const canvas = new fabric.Canvas('editor-canvas', {
  selection: false,
  preserveObjectStacking: true,
});

// Global references
let pfpImage = null;
let glassesImage = null;
let uploadedSize = { width: 512, height: 512 };

// Handle image upload
document.getElementById('upload-image').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (f) {
    fabric.Image.fromURL(f.target.result, function (img) {
      // Remove existing PFP if exists
      if (pfpImage) canvas.remove(pfpImage);

      // Resize canvas to match uploaded image size
      uploadedSize = { width: img.width, height: img.height };
      canvas.setWidth(img.width);
      canvas.setHeight(img.height);

      img.set({
        left: 0,
        top: 0,
        selectable: true,
        hasBorders: false,
        hasControls: false,
        lockRotation: true,
        lockScalingFlip: true,
      });

      img.scaleToWidth(img.width);
      pfpImage = img;
      canvas.add(img);
      canvas.sendToBack(img);

      loadGlasses(); // load glasses after base image
    });
  };
  reader.readAsDataURL(file);
});

// Load glasses image
function loadGlasses() {
  if (glassesImage) {
    canvas.remove(glassesImage);
  }

  fabric.Image.fromURL('assets/intuition-glasses.png', function (img) {
    img.set({
      left: canvas.width / 2 - img.width / 4,
      top: canvas.height / 2 - img.height / 4,
      hasBorders: true,
      hasControls: true,
      cornerStyle: 'circle',
      transparentCorners: false,
      borderColor: '#ccc',
      cornerColor: '#ccc',
      rotatingPointOffset: 20,
    });

    img.scale(0.5);
    glassesImage = img;
    canvas.add(img);
    canvas.setActiveObject(img);
  });
}

// Reset button
document.getElementById('reset-btn').addEventListener('click', () => {
  canvas.clear();
  pfpImage = null;
  glassesImage = null;
  canvas.setWidth(512);
  canvas.setHeight(512);
});

// Download button
document.getElementById('download-btn').addEventListener('click', () => {
  if (!pfpImage) return alert("Upload a PFP first.");

  // Temporarily hide UI handles
  if (glassesImage) {
    glassesImage.set({
      hasBorders: false,
      hasControls: false
    });
  }

  canvas.discardActiveObject();
  canvas.renderAll();

  // Export at original PFP size
  const dataURL = canvas.toDataURL({
    format: 'png',
    left: 0,
    top: 0,
    width: uploadedSize.width,
    height: uploadedSize.height,
    multiplier: 1,
    enableRetinaScaling: false
  });

  const link = document.createElement('a');
  link.href = dataURL;
  link.download = 'intuition-pfp.png';
  link.click();

  // Restore UI
  if (glassesImage) {
    glassesImage.set({
      hasBorders: true,
      hasControls: true
    });
  }

  canvas.renderAll();
});

// Mint button (fake animation/hover only)
document.getElementById('mint-btn').addEventListener('click', () => {
  alert('✨ Ritual submitted to the chain. (Fake Mint)');
});
