const canvas = new fabric.Canvas('editor-canvas', {
  selection: false,
  preserveObjectStacking: true
});

let pfpImage = null;
let glassesImage = null;
let originalSize = 512;

// Set up canvas size and scale all items on resize
function fitCanvasSize() {
  const container = document.getElementById('canvas-container');
  const newSize = Math.min(window.innerWidth - 40, originalSize);

  // scaleFactor is ratio of new size to current canvas size
  const scaleFactor = newSize / canvas.getWidth();

  canvas.setWidth(newSize);
  canvas.setHeight(newSize);
  container.style.width = ${newSize}px;

  // Rescale all objects on canvas
  canvas.getObjects().forEach((obj) => {
    obj.scaleX *= scaleFactor;
    obj.scaleY *= scaleFactor;
    obj.left *= scaleFactor;
    obj.top *= scaleFactor;
    obj.setCoords();
  });

  canvas.renderAll();
}

window.addEventListener('resize', fitCanvasSize);

// Upload image
document.getElementById('upload-image').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (f) {
    fabric.Image.fromURL(f.target.result, function (img) {
      // Clear canvas
      canvas.clear();
      pfpImage = null;
      glassesImage = null;

      // Set canvas base size
      canvas.setWidth(originalSize);
      canvas.setHeight(originalSize);

      // Center image
      img.set({
        originX: 'center',
        originY: 'center',
        left: canvas.width / 2,
        top: canvas.height / 2,
        selectable: false,
        hasControls: false,
        hasBorders: false
      });

      // Fit image to canvas
      const scale = Math.min(
        canvas.width / img.width,
        canvas.height / img.height
      );
      img.scale(scale);

      pfpImage = img;
      canvas.add(pfpImage);
      canvas.sendToBack(pfpImage);

      loadGlasses();
      fitCanvasSize(); // Trigger proper canvas scale
    });
  };
  reader.readAsDataURL(file);
});

// Load glasses
function loadGlasses() {
  fabric.Image.fromURL('assets/intuition-glasses.png', function (img) {
    img.set({
      originX: 'center',
      originY: 'center',
      left: canvas.width / 2,
      top: canvas.height / 2,
      hasControls: true,
      hasBorders: true,
      cornerStyle: 'circle',
      borderColor: '#aaa',
      cornerColor: '#aaa',
      transparentCorners: false
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
  canvas.setWidth(originalSize);
  canvas.setHeight(originalSize);
  fitCanvasSize();
});

// Download
document.getElementById('download-btn').addEventListener('click', () => {
  if (!pfpImage) return alert("Upload a PFP first.");

  if (glassesImage) {
    glassesImage.set({
      hasControls: false,
      hasBorders: false
    });
  }

  canvas.discardActiveObject();
  canvas.renderAll();

  const dataURL = canvas.toDataURL({
    format: 'png',
    multiplier: 2
  });

  const link = document.createElement('a');
  link.href = dataURL;
  link.download = 'intuition-pfp.png';
  link.click();

  if (glassesImage) {
    glassesImage.set({
      hasControls: true,
      hasBorders: true
    });
  }

  canvas.renderAll();
});

// Fake mint
document.getElementById('mint-btn').addEventListener('click', () => {
  alert('🕯 Ritual minted to the void... (fake)');
});

// Initial fit
fitCanvasSize();
