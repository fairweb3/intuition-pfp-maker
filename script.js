const canvas = new fabric.Canvas("editor-canvas", {
  preserveObjectStacking: true,
  selection: false
});

let pfpImage = null;
let glassesImage = null;

const uploadInput = document.getElementById("pfp-upload");
const uploadArea = document.getElementById("upload-area");
const resetBtn = document.getElementById("reset-btn");
const downloadBtn = document.getElementById("download-btn");
const mintBtn = document.getElementById("mint-btn");

// Load glasses
fabric.Image.fromURL("assets/intuition-glasses.png", (img) => {
  glassesImage = img;
  glassesImage.set({
    left: 250,
    top: 250,
    scaleX: 0.5,
    scaleY: 0.5,
    cornerStyle: "circle",
    transparentCorners: false,
    hasBorders: true,
    hasControls: true,
    selectable: true,
    cornerColor: "#fff"
  });
  canvas.add(glassesImage);
  canvas.bringToFront(glassesImage);
});

// Handle upload
uploadInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (f) {
    fabric.Image.fromURL(f.target.result, (img) => {
      if (pfpImage) canvas.remove(pfpImage);

      // Resize to fit canvas (max 600x600)
      const scaleRatio = Math.min(
        600 / img.width,
        600 / img.height,
        1
      );
      img.set({
        left: 300,
        top: 300,
        originX: "center",
        originY: "center",
        scaleX: scaleRatio,
        scaleY: scaleRatio,
        selectable: true,
        hasControls: false,
        hasBorders: false
      });

      pfpImage = img;
      canvas.add(pfpImage);
      canvas.sendToBack(pfpImage);
      uploadArea.style.display = "none";
    });
  };
  reader.readAsDataURL(file);
});

// Reset
resetBtn.addEventListener("click", () => {
  canvas.clear();
  pfpImage = null;
  uploadInput.value = "";
  uploadArea.style.display = "flex";

  // Reload glasses
  fabric.Image.fromURL("assets/intuition-glasses.png", (img) => {
    glassesImage = img;
    glassesImage.set({
      left: 250,
      top: 250,
      scaleX: 0.5,
      scaleY: 0.5,
      cornerStyle: "circle",
      transparentCorners: false,
      hasBorders: true,
      hasControls: true,
      selectable: true,
      cornerColor: "#fff"
    });
    canvas.add(glassesImage);
    canvas.bringToFront(glassesImage);
  });
});

// Download
downloadBtn.addEventListener("click", () => {
  if (!pfpImage) return;

  const dataURL = canvas.toDataURL({
    format: "png",
    quality: 1,
    withoutTransform: true,
    enableRetinaScaling: false
  });

  const link = document.createElement("a");
  link.href = dataURL;
  link.download = "intuition-pfp.png";
  link.click();
});

// Mint fake button (optional)
mintBtn.addEventListener("click", () => {
  mintBtn.innerText = "✨ Ritual Complete";
  setTimeout(() => {
    mintBtn.innerText = "Mint NFT";
  }, 1500);
});
