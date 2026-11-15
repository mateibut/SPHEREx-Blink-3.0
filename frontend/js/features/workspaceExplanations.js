// The Science Mode Workspace's 13 panel explanations and five viewer-mode notes.
// Keys are stable aria-labelledby IDs (or a panel ID when no heading ID exists).
// These are reviewed educational descriptions, not answers from an AI model.
export const PANEL_EXPLANATIONS = Object.freeze({
  "controls-title": {
    what: "The sky has its own address system! Right Ascension (RA) and Declination (Dec) work like longitude and latitude on Earth. Field of View controls how much sky you see.",
    try: "Enter RA and Dec, then press Load images. Or choose Barnard's Star from the test objects to get started.",
    remember: "Check whether the images are labelled synthetic demo data or real observations."
  },
  "player-title": {
    what: "This is where you become a space detective! Examine images of the same region taken at different times and infrared wavelengths. Moving objects may appear to jump while most background stars stay nearly still.",
    try: "Choose Barnard's Star, load the images and press Blink. Then try Difference, Stack, Trail and Compare to see what changes.",
    remember: "A moving dot is a clue, not yet a confirmed discovery. Changes in wavelength or image quality can also affect the picture."
  },
  "inspector-title": {
    what: "Think of the Inspector as the information label attached to a telescope image. It shows the detector, wavelength, observation time and quality flags, along with details of any position you mark.",
    try: "Load an image, move to another frame and compare its detector and wavelength. Click a position in the picture to inspect it.",
    remember: "The information describes the current image or selected position; it does not prove that an object is new."
  },
  "search-findings": {
    what: "This is where the computer shows interesting sources found in the images. Some may be stars with apparent motion, asteroids or other possible sources. Each result is a candidate that needs checking.",
    try: "After loading a field with enough observations, use Find movers or Find everything, then select a result to examine its position and supporting evidence.",
    remember: "Noise, chance matches and known objects can appear among the results. A candidate is not a discovery."
  },
  "measure-title": {
    what: "Every dot of light has a story. A spectrum shows how its measured brightness changes with wavelength; a light curve shows how it changes over time.",
    try: "Click a source in the image and compare its measurements across available frames and detectors.",
    remember: "Brightness measurements have uncertainty. Different wavelengths, background light and image quality can change the values."
  },
  "predict-title": {
    what: "Where might this object appear next? By examining its measured movement, the tool estimates another position, much like predicting where a moving car will be from its direction and speed.",
    try: "Select a candidate with measurements and inspect its predicted path or position using the forecast controls.",
    remember: "A prediction is not a new observation. Uncertainty grows when we look further beyond the measured times."
  },
  "observation-tools-title": {
    what: "Astronomers rarely trust a single picture. These controls help you work through observations from different dates and infrared wavelengths, and inspect possible movement.",
    try: "Load several frames, use the timeline and keyboard shortcuts to step through them, and compare the images.",
    remember: "A change between frames may reflect motion, noise, or differences between infrared wavelengths."
  },
  "context-title": {
    what: "This is your window into the surrounding sky! Sky Context compares the region using astronomical surveys such as 2MASS, AllWISE and DSS2. The dashed square marks the Blink field; catalogue markers indicate known objects.",
    try: "Press Show sky map, switch surveys and drag around the nearby sky. Read RA and Dec under the cursor and click empty sky to send a position to Workspace.",
    remember: "These surveys were taken at different times and wavelengths. A difference between them is not automatically a moving object."
  },
  "pin-board-title": {
    what: "Found something interesting? The Discovery Pin Board lets you mark a candidate and share its location with other visitors. Pins include information that helps others investigate it.",
    try: "Select an unexplained candidate in Search results and choose Pin & Report Object. You can also explore the board and click empty sky to load its coordinates in Workspace.",
    remember: "Pinning an object does not prove a discovery. Scientific discoveries require independent verification."
  },
  "lab-title": {
    what: "Could a moving dot be a very distant object? This laboratory compares motion patterns, including the apparent shift caused by Earth moving around the Sun. It can also insert synthetic objects into images to test the search.",
    try: "Select a candidate and compare the stationary, straight-line and parallax motion fits. Run the injection test when suitable observations are available.",
    remember: "An injection test measures detection performance; it does not discover a planet. Planet X remains hypothetical."
  },
  "sky-title": {
    what: "Imagine a map showing where your available telescope image files were taken. Each marked region represents observations that the connected system can access.",
    try: "When connected to a backend with real files, press Read the footprints and select a mapped field to explore it.",
    remember: "This is a map of the files available here, not a complete coverage map of the entire SPHEREx survey. The synthetic demo has no real file footprints."
  },
  "assistant-title": {
    what: "Why did the computer select this object? This tool explains the evidence behind a candidate using the measurements found in the images.",
    try: "Select a candidate, then ask why it is a candidate, what could make it wrong, and what should be checked next.",
    remember: "These answers follow rules tied to measured values, not a general AI chatbot. An explanation is not proof of a discovery."
  },
  "ta-title": {
    what: "Not everything in astronomy needs a picture! This section presents images, detected dots and candidates as tables of positions, signal quality, warnings and measurements.",
    try: "Press Build the text analysis, inspect the tables and export the data as CSV if you want to check them elsewhere.",
    remember: "The tables record the available data, including whether they came from real observations or a synthetic demo. They do not independently verify a candidate."
  }
});

export const MODE_EXPLANATIONS = Object.freeze({
  blink: "Watch the images switch back and forth like a flipbook. A moving object may appear to jump between positions, while most background stars stay still. A moving dot is only a candidate.",
  diff: "Compare each image with the median of images from other dates to remove much of the light that stays the same. Orange means brighter than the comparison; blue means fainter. Moving sources can stand out, but noise and wavelength differences can also create residuals.",
  mean: "Combine multiple images into one average picture. This can reduce random noise and make faint stationary objects easier to see. Moving objects may look blurred or fade away.",
  max: "Keep the brightest value of each pixel across all images. A moving object can leave a chain of bright dots showing where it appeared at different times; a still star usually stays a single dot.",
  compare: "Choose two images or survey passes. Subtract A − B to highlight changes (orange is brighter in A; blue is fainter), or combine A + B to see their average. This helps examine changes in position or brightness, but different wavelengths can also leave residuals."
});

/** Unknown panels retain their existing glossary fallback in scienceExplain.js. */
export function workspaceExplanation(key) {
  return Object.hasOwn(PANEL_EXPLANATIONS, key) ? PANEL_EXPLANATIONS[key] : null;
}
