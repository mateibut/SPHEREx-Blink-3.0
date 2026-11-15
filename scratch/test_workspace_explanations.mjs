// Workspace help coverage and viewer-mode guidance.
// Run: node scratch/test_workspace_explanations.mjs
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { PANEL_EXPLANATIONS, MODE_EXPLANATIONS, workspaceExplanation } from "../frontend/js/features/workspaceExplanations.js";

const html = readFileSync(new URL("../frontend/index.html", import.meta.url), "utf8");
const main = readFileSync(new URL("../frontend/js/main.js", import.meta.url), "utf8");
const explain = readFileSync(new URL("../frontend/js/scienceExplain.js", import.meta.url), "utf8");
const css = readFileSync(new URL("../frontend/css/styles.css", import.meta.url), "utf8");

const sectionKeys = new Set([...html.matchAll(/<(?:section|aside)\b([^>]*\bclass="[^"]*\bpanel\b[^"]*"[^>]*)>/g)]
  .map((m) => m[1].match(/\baria-labelledby="([^"]+)"/)?.[1] ?? m[1].match(/\bid="([^"]+)"/)?.[1]).filter(Boolean));
const documentedKeys = new Set(Object.keys(PANEL_EXPLANATIONS));
assert.equal(documentedKeys.size, 13, "13 section-specific explanations, no missing panels");
assert.deepEqual(documentedKeys, sectionKeys, "every Workspace panel gets its own help via stable ID");
for (const [id, note] of Object.entries(PANEL_EXPLANATIONS)) {
  assert.deepEqual(Object.keys(note).sort(), ["remember", "try", "what"], id + ": help structure");
  assert.ok(Object.values(note).every((value) => typeof value === "string" && value.length > 55 && value.length < 700), id + ": concise meaningful text");
  assert.equal(workspaceExplanation(id), note);
}
assert.equal(workspaceExplanation("other-site-panel"), null, "unknown headings still use glossary fallback");
assert.ok(explain.includes("workspaceExplanation(panelKey)"), "panel renderer uses the keyed descriptions");
assert.ok(explain.includes('button.setAttribute("aria-controls", answer.id)'), "toggle announces its controlled content");
for (const label of ["What does this tool do?", "Try it yourself", "Keep in mind"]) {
  assert.ok(explain.includes(label), "structured explanation heading: " + label);
}
assert.ok(css.includes(".science-explain-item"), "help cards are styled");
const modes = [...html.matchAll(/<input type="radio" name="mode" value="([^"]+)"/g)].map(x => x[1]);
assert.deepEqual(Object.keys(MODE_EXPLANATIONS).sort(), modes.sort(), "all five view modes have clear descriptions");
assert.ok(Object.values(MODE_EXPLANATIONS).every(text => typeof text === "string" && text.length > 100 && text.length < 520));
assert.ok(main.includes('$("mode-help").textContent = MODE_EXPLANATIONS[mode];'), "mode help updates when modes change");
assert.ok(html.includes('src="js/scienceExplain.js?v=2"') && html.includes('js/main.js?v=26'), "bust cached JS");
console.log("PASS Workspace: 13 panel explanations and five viewing-mode descriptions");
