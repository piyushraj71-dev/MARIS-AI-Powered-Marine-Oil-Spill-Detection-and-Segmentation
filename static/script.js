const imageInput = document.getElementById("imageInput");
const dropZone = document.getElementById("dropZone");
const previewWrap = document.getElementById("previewWrap");
const inputPreview = document.getElementById("inputPreview");
const analyzeButton = document.getElementById("analyzeButton");
const buttonText = document.getElementById("buttonText");
const errorBox = document.getElementById("errorBox");
const apiStatus = document.getElementById("apiStatus");
let selectedFile = null;
let previewUrl = null;

const $ = (id) => document.getElementById(id);

async function checkHealth() {
  try {
    const response = await fetch("/health");
    if (!response.ok) throw new Error("API not healthy");
    apiStatus.textContent = "Connected · healthy";
  } catch {
    apiStatus.textContent = "Connection unavailable";
    document.querySelector(".status-dot").style.background = "#ff777d";
    document.querySelector(".status-dot").style.boxShadow = "0 0 12px #ff777d55";
  }
}
checkHealth();

function showError(message) {
  errorBox.textContent = message;
  errorBox.classList.remove("hidden");
}
function clearError() {
  errorBox.textContent = "";
  errorBox.classList.add("hidden");
}
function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
function setFile(file) {
  clearError();
  if (!file) return;
  const allowed = ["image/jpeg", "image/png"];
  const extAllowed = /\.(jpe?g|png)$/i.test(file.name);
  if (!allowed.includes(file.type) && !extAllowed) {
    showError("Unsupported file type. Please choose a JPG, JPEG or PNG image.");
    return;
  }
  selectedFile = file;
  if (previewUrl) URL.revokeObjectURL(previewUrl);
  previewUrl = URL.createObjectURL(file);
  inputPreview.src = previewUrl;
  $("fileName").textContent = file.name;
  $("fileSize").textContent = formatBytes(file.size);
  $("uploadTitle").textContent = "Image selected";
  $("uploadSubtitle").textContent = "Choose another file any time";
  previewWrap.classList.remove("hidden");
  analyzeButton.disabled = false;
  resetPipeline();
}
imageInput.addEventListener("change", () => setFile(imageInput.files[0]));
$("removeImage").addEventListener("click", () => {
  selectedFile = null;
  imageInput.value = "";
  if (previewUrl) URL.revokeObjectURL(previewUrl);
  previewUrl = null;
  inputPreview.removeAttribute("src");
  previewWrap.classList.add("hidden");
  $("uploadTitle").textContent = "Drop your image here";
  $("uploadSubtitle").innerHTML = 'or <em>browse files</em> from your device';
  analyzeButton.disabled = true;
  clearError();
  resetPipeline();
});
["dragenter", "dragover"].forEach(eventName => dropZone.addEventListener(eventName, event => {
  event.preventDefault(); dropZone.classList.add("dragging");
}));
["dragleave", "drop"].forEach(eventName => dropZone.addEventListener(eventName, event => {
  event.preventDefault(); dropZone.classList.remove("dragging");
}));
dropZone.addEventListener("drop", event => {
  const file = event.dataTransfer.files[0];
  if (file) setFile(file);
});

function setStep(id, state, label) {
  const el = $(id);
  el.classList.remove("active", "done");
  if (state) el.classList.add(state);
  el.querySelector(".step-state").textContent = label;
}
function resetPipeline() {
  setStep("stepUpload", "", "READY");
  setStep("stepClassify", "", "WAITING");
  setStep("stepSegment", "", "CONDITIONAL");
  setStep("stepReport", "", "WAITING");
  $("pipelineMessage").textContent = "Ready when you are. Select an image to begin.";
}
function setLoading(loading) {
  analyzeButton.disabled = loading || !selectedFile;
  buttonText.textContent = loading ? "Analyzing satellite image…" : "Run oil-spill analysis";
  if (loading) {
    analyzeButton.querySelector(".button-icon").innerHTML = '<span class="loading-spinner"></span>';
    $("pipelineMessage").textContent = "Running classification and preparing results…";
  } else {
    analyzeButton.querySelector(".button-icon").textContent = "✦";
  }
}
function displayValue(value) {
  if (value === null || value === undefined || value === "") return "—";
  if (Array.isArray(value)) return value.map(v => typeof v === "number" ? fmtNumber(v) : String(v)).join(", ");
  if (typeof value === "object") return Object.entries(value).map(([k, v]) => `${k}: ${typeof v === "number" ? fmtNumber(v) : v}`).join(" · ");
  return typeof value === "number" ? fmtNumber(value) : String(value);
}
function fmtNumber(value) {
  return Number.isInteger(value) ? String(value) : Number(value).toFixed(4).replace(/0+$/, "").replace(/\.$/, "");
}
function probabilityPercent(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "—";
  return `${(n * 100).toFixed(1)}%`;
}
function setImageStage(stageId, linkId, url, alt) {
  const stage = $(stageId);
  const link = $(linkId);
  stage.replaceChildren();
  if (url) {
    const img = document.createElement("img");
    img.src = url;
    img.alt = alt;
    img.onerror = () => { stage.innerHTML = '<div class="image-placeholder">Could not load this output image.</div>'; };
    stage.appendChild(img);
    link.href = url;
    link.classList.remove("hidden");
  } else {
    stage.innerHTML = '<div class="image-placeholder">Segmentation is not available for this result.</div>';
    link.removeAttribute("href");
    link.classList.add("hidden");
  }
}
function renderResult(payload) {
  // API response shape: { job_id, result: { ...metrics }, files: { mask, overlay, json } }
  const result = payload.result || {};
  const files = payload.files || {};
  const oilDetected = result.result === "OIL_DETECTED";
  const probability = result.oil_probability;

  $("emptyState").classList.add("hidden");
  $("resultContent").classList.remove("hidden");
  $("jobId").textContent = `JOB ${payload.job_id || result.job_id || "—"}`;
  $("resultBanner").classList.toggle("no-oil", !oilDetected);
  $("resultSymbol").textContent = oilDetected ? "!" : "✓";
  $("resultHeading").textContent = oilDetected ? "Potential oil spill detected" : "No oil detected";
  $("resultDescription").textContent = oilDetected
    ? "The classifier crossed its detection threshold. Segmentation results are shown below."
    : "The classifier did not cross its oil-detection threshold, so segmentation was skipped.";
  $("probabilityValue").textContent = probabilityPercent(probability);
  const prob = Number(probability);
  $("probabilityBar").style.width = Number.isFinite(prob) ? `${Math.max(0, Math.min(1, prob)) * 100}%` : "0%";

  $("spillArea").textContent = result.spill_area == null ? "—" : displayValue(result.spill_area);
  $("centroid").textContent = displayValue(result.centroid);
  $("boundingBox").textContent = displayValue(result.bounding_box);
  $("perimeter").textContent = displayValue(result.perimeter);

  setImageStage("maskStage", "maskDownload", files.mask, "Predicted oil spill segmentation mask");
  setImageStage("overlayStage", "overlayDownload", files.overlay, "Satellite image with oil spill highlighted");
  if (files.json) {
    $("jsonLink").href = files.json;
    $("jsonLink").classList.remove("hidden");
  } else {
    $("jsonLink").classList.add("hidden");
  }

  setStep("stepUpload", "done", "COMPLETE");
  setStep("stepClassify", "done", "COMPLETE");
  setStep("stepSegment", oilDetected ? "done" : "", oilDetected ? "COMPLETE" : "SKIPPED");
  setStep("stepReport", "done", "COMPLETE");
  $("pipelineMessage").textContent = oilDetected
    ? "Analysis complete. Review the predicted mask and overlay."
    : "Classification complete. No spill mask was generated.";
  $("results").scrollIntoView({ behavior: "smooth", block: "start" });
}

analyzeButton.addEventListener("click", async () => {
  if (!selectedFile) return;
  clearError();
  setLoading(true);
  setStep("stepUpload", "active", "UPLOADING");
  setStep("stepClassify", "active", "RUNNING");
  setStep("stepSegment", "", "CONDITIONAL");
  setStep("stepReport", "", "WAITING");
  try {
    const formData = new FormData();
    formData.append("file", selectedFile);
    const response = await fetch("/predict", { method: "POST", body: formData });
    let payload;
    try { payload = await response.json(); }
    catch { throw new Error(`Server returned an unreadable response (HTTP ${response.status}).`); }
    if (!response.ok) {
      const detail = payload.detail || payload.message || `Request failed with HTTP ${response.status}.`;
      throw new Error(typeof detail === "string" ? detail : JSON.stringify(detail));
    }
    if (!payload.result) throw new Error("The API response did not contain the expected 'result' object.");
    renderResult(payload);
  } catch (error) {
    showError(`Analysis failed: ${error.message}. Check that the API is running and the model files are available.`);
    $("pipelineMessage").textContent = "The request did not complete. Check the API status and try again.";
    setStep("stepUpload", "", "FAILED");
    setStep("stepClassify", "", "FAILED");
  } finally {
    setLoading(false);
  }
});
