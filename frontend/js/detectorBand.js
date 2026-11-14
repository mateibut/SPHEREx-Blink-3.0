import { EXPECTED_DETECTORS } from "./features/spectral.js";
import { TARGETS, positionAtEpoch } from "./targets.js";

const $ = (id) => document.getElementById(id);

/** Interactive wavelength guide for the telescope section. */
function setupDetectorBand() {
  const strip = $("detector-band-strip");
  const range = $("detector-band-range");
  const demo = $("detector-band-demo");
  const target = TARGETS.find(({ id }) => id === "barnard");
  const { ra, dec } = positionAtEpoch(target);
  const buttons = EXPECTED_DETECTORS.map(({ id, wlMin, wlMax }, index) => {
    const button = document.createElement("button");
    const band = `${wlMin.toFixed(2)}–${wlMax.toFixed(2)} µm`;
    button.type = "button";
    button.textContent = id;
    button.setAttribute("aria-label", `${id}, approximately ${band}`);
    button.style.setProperty("--band-width", String(wlMax - wlMin));
    button.style.setProperty("--band-tint", String(.08 + index * .04));
    button.addEventListener("click", () => {
      for (const segment of buttons) segment.setAttribute("aria-pressed", String(segment === button));
      range.textContent = `Detector ${id} · approximately ${band}`;
      const query = new URLSearchParams({ ra: ra.toFixed(5), dec: dec.toFixed(5), fov: "5", det: id });
      demo.href = `index.html?${query}#workspace`;
    });
    return button;
  });
  strip.replaceChildren(...buttons);
  buttons[0].click();
  $("detector-band").hidden = false;
}
setupDetectorBand();
