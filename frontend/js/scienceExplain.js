import { explanationFor } from "./features/spaceGuide.js";
import { workspaceExplanation } from "./features/workspaceExplanations.js";

const panels = document.querySelectorAll("main .panel");
for (const panel of panels) {
  const headingId = panel.getAttribute("aria-labelledby");
  const heading = headingId ? document.getElementById(headingId) : panel.querySelector("h2,h3");
  const title = heading?.textContent?.trim();
  if (!title) continue;
  const panelKey = headingId || panel.id;
  const workspaceHelp = workspaceExplanation(panelKey);
  const control = document.createElement("div");
  control.className = "science-explain";
  const button = document.createElement("button");
  button.type = "button";
  button.className = "science-explain-button";
  button.textContent = "Explain Simply";
  button.setAttribute("aria-expanded", "false");
  const answer = document.createElement("div");
  answer.className = "science-explain-answer";
  answer.id = `science-explain-${panelKey || "panel"}`;
  button.setAttribute("aria-controls", answer.id);
  answer.hidden = true;
  answer.setAttribute("role", "status");
  if (workspaceHelp) {
    for (const [headingText, body] of [
      ["What does this tool do?", workspaceHelp.what],
      ["Try it yourself", workspaceHelp.try],
      ["Keep in mind", workspaceHelp.remember]
    ]) {
      const item = document.createElement("div");
      item.className = "science-explain-item";
      const heading = document.createElement("strong");
      heading.textContent = headingText;
      const text = document.createElement("p");
      text.textContent = body;
      item.append(heading, text);
      answer.append(item);
    }
  } else {
    const explanation = explanationFor(title);
    answer.textContent = `${explanation.label}: ${explanation.simple} ${explanation.context}`;
  }
  button.addEventListener("click", () => {
    const open = answer.hidden;
    answer.hidden = !open;
    button.setAttribute("aria-expanded", String(open));
    button.textContent = open ? "Hide simple explanation" : "Explain Simply";
  });
  control.append(button, answer);
  const header = panel.querySelector(":scope > .panel-head");
  if (header) header.insertAdjacentElement("afterend", control);
  else if (heading && panel.contains(heading)) heading.insertAdjacentElement("afterend", control);
  else panel.prepend(control);
}

// Calmer panels: a long first description is shortened to two lines with a "More" toggle (the full text stays in the page for screen readers).
for (const panel of panels) {
  const intro = [...panel.children].find((el) => el.tagName === "P" && el.textContent.trim().length > 200);
  if (!intro || intro.id) continue;
  intro.classList.add("panel-intro", "is-clamped");
  const more = document.createElement("button");
  more.type = "button";
  more.className = "panel-intro-more";
  more.textContent = "More";
  more.setAttribute("aria-expanded", "false");
  more.addEventListener("click", () => {
    const open = intro.classList.toggle("is-clamped") === false;
    more.textContent = open ? "Less" : "More";
    more.setAttribute("aria-expanded", String(open));
  });
  intro.insertAdjacentElement("afterend", more);
}
