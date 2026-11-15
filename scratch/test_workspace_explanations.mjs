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
assert.ok(main.includes('$("mode-help").textContent = MODE_EXPLANATIONS[player.mode];'), "restored mode from deep link updates guidance");
assert.doesNotMatch(main, /\\bMODE_HELP\\b/, "old undefined mode-help object is not referenced");
assert.ok(html.includes('src="js/scienceExplain.js?v=2"') && html.includes('js/main.js?v=27'), "bust cached JS");
// Exercise the actual Explain Simply script with a small DOM mock: all 13 panels
// must render three useful parts and their buttons must open and close the card.
function fakeElement(tagName) {
  return {
    tagName: tagName.toUpperCase(), children: [], attrs: {}, events: {},
    textContent: "", hidden: false, className: "",
    setAttribute(name, value) { this.attrs[name] = String(value); },
    getAttribute(name) { return this.attrs[name] ?? null; },
    addEventListener(name, cb) { this.events[name] = cb; },
    append(...kids) { this.children.push(...kids); },
    prepend(kid) { this.children.unshift(kid); },
    contains() { return false; },
    querySelector() { return null; },
    insertAdjacentElement() {},
    get classList() { return { add() {}, toggle() { return false; } }; }
  };
}
const keys = Object.keys(PANEL_EXPLANATIONS);
const fakePanels = keys.map(key => {
  const panel = fakeElement("section");
  panel.id = key === "search-findings" ? key : "";
  panel.getAttribute = (name) => name === "aria-labelledby" && key !== "search-findings" ? key : null;
  panel.querySelector = (selector) => key === "search-findings" && selector === "h2,h3" ? { textContent: "Search results" } : null;
  return panel;
});
const fakeDoc = {
  querySelectorAll(selector) { return selector === "main .panel" ? fakePanels : []; },
  getElementById(key) { return { textContent: key }; },
  createElement: fakeElement
};
new Function("document", "workspaceExplanation", "explanationFor",
  explain.replace(/^import .*;\s*$/gm, ""))(fakeDoc, workspaceExplanation, () => {
    throw new Error("Known panels should never use the generic fallback");
  });
for (const [i, panel] of fakePanels.entries()) {
  const control = panel.children.find(el => el.className === "science-explain");
  assert.ok(control, "panel " + keys[i] + " has its Explain Simply control");
  const [button, answer] = control.children;
  assert.equal(button.attrs["aria-expanded"], "false");
  assert.equal(button.attrs["aria-controls"], answer.id);
  assert.equal(answer.hidden, true);
  assert.deepEqual(answer.children.map(item => item.children[0].textContent),
    ["What does this tool do?", "Try it yourself", "Keep in mind"]);
  button.events.click();
  assert.equal(answer.hidden, false);
  assert.equal(button.attrs["aria-expanded"], "true");
  button.events.click();
  assert.equal(answer.hidden, true);
  assert.equal(button.attrs["aria-expanded"], "false");
}

console.log("PASS Workspace: 13 panel explanations and five viewing-mode descriptions");
