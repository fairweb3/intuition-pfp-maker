const canvas = new fabric.Canvas('editor-canvas', {
  selection: false,
  preserveObjectStacking: true
});

let pfpImage = null;
let glassesImage = null;
let uploadedSize = { width: 512, height: 512 };

// Upload PFP
document.getElementById('upload-image').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (f) {
    fabric.Image.fromURL(f.target.result, function (img) {
      // Remove previous
      if (pfpImage) canvas.remove(pfpImage);
      if (glassesImage) canvas.remove(glassesImage);

      // Match canvas to uploaded image
      uploadedSize = { width: img.width, height: img.height };
      canvas.setWidth(img.width);
      canvas.setHeight(img.height);

      img.set({
        selectable: true,
        hasControls: false,
        hasBorders: false,
        lockRotation: true,
        lockScalingFlip: true
      });

      pfpImage = img;
      canvas.add(pfpImage);
      canvas.sendToBack(pfpImage);

      loadGlasses(); // auto-load glasses after PFP
    });
  };
  reader.readAsDataURL(file);
});

// Load & add glasses overlay
function loadGlasses() {
  fabric.Image.fromURL('assets/intuition-glasses.png', function (img) {
    img.set({
      left: canvas.width / 2 - img.width / 4,
      top: canvas.height / 2 - img.height / 4,
      hasControls: true,
      hasBorders: true,
      cornerStyle: 'circle',
      borderColor: '#aaa',
      cornerColor: '#aaa',
      transparentCorners: false,
      rotatingPointOffset: 20
    });

    img.scale(0.5);
    glassesImage = img;
    canvas.add(glassesImage);
    canvas.setActiveObject(glassesImage);
  });
}

// Reset
document.getElementById('reset-btn').addEventListener('click', () => {
  canvas.clear();
  pfpImage = null;
  glassesImage = null;
  canvas.setWidth(512);
  canvas.setHeight(512);
});

// Download clean PNG
document.getElementById('download-btn').addEventListener('click', () => {
  if (!pfpImage) return alert("Upload a PFP first.");

  // Temporarily remove UI
  if (glassesImage) {
    glassesImage.set({
      hasBorders: false,
      hasControls: false
    });
  }

  canvas.discardActiveObject();
  canvas.renderAll();

  const dataURL = canvas.toDataURL({
    format: 'png',
    left: 0,
    top: 0,
    width: uploadedSize.width,
    height: uploadedSize.height,
    multiplier: 1
  });

  const link = document.createElement('a');
  link.href = dataURL;
  link.download = 'intuition-pfp.png';
  link.click();

  // Restore UI handles
  if (glassesImage) {
    glassesImage.set({
      hasBorders: true,
      hasControls: true
    });
  }

  canvas.renderAll();
});

// Fake Mint button
document.getElementById('mint-btn').addEventListener('click', () => {
  alert('🕯 Ritual minted to the void... (fake)');
});
