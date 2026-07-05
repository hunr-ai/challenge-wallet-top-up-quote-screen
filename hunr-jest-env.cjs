// Hunr Progress Protocol reporter (node_jest / React Native), as a custom test
// environment. Same rationale as the node templates (jest's CLI `--reporters`
// override rules out a config reporter), but here we extend React Native's own
// Jest environment so RN component rendering keeps working — we only add the
// `handleTestEvent` hook on top.
//
// Purely additive: emits only when HUNR_PROGRESS=stream; the jest-junit report
// stays authoritative. Emits one `session` (after collection) then a `case` per
// finished test.
const path = require("path");

// react-native's jest env is exported as the class directly.
const Base = require("react-native/jest/react-native-env");
const ENABLED = process.env.HUNR_PROGRESS === "stream";
const SENTINEL = "@@HUNR@@";

function emit(obj) {
  try {
    process.stdout.write(SENTINEL + " " + JSON.stringify(obj) + "\n");
  } catch (_e) {
    /* never let progress break a run */
  }
}

function fullName(test) {
  const parts = [];
  let b = test.parent;
  while (b && b.name && b.name !== "ROOT_DESCRIBE_BLOCK") {
    parts.unshift(b.name);
    b = b.parent;
  }
  parts.push(test.name);
  return parts.join(" > ");
}

module.exports = class HunrProgressEnv extends Base {
  constructor(config, context) {
    super(config, context);
    this._rel = path
      .relative(process.cwd(), context.testPath)
      .split(path.sep)
      .join("/");
  }

  async handleTestEvent(event, state) {
    if (super.handleTestEvent) await super.handleTestEvent(event, state);
    if (!ENABLED) return;

    if (event.name === "run_start") {
      const cases = [];
      const walk = (block) => {
        for (const child of block.children || []) {
          if (child.type === "test") {
            cases.push({ id: this._rel + "::" + fullName(child), name: child.name, file: this._rel });
          } else {
            walk(child);
          }
        }
      };
      walk(state.rootDescribeBlock);
      if (cases.length) emit({ event: "session", cases });
    } else if (event.name === "test_done") {
      const t = event.test;
      const status = t.errors && t.errors.length ? "failed" : "passed";
      emit({ event: "case", id: this._rel + "::" + fullName(t), status, time: (t.duration || 0) / 1000 });
    } else if (event.name === "test_skip" || event.name === "test_todo") {
      emit({ event: "case", id: this._rel + "::" + fullName(event.test), status: "skipped", time: 0 });
    }
  }
};
