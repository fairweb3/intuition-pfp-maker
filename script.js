const canvas = new fabric.Canvas('editor-canvas', {
  selection: false,
  preserveObjectStacking: true
});

let pfpImage = null;
let glassesImage = null;
let originalCanvasSize = 512;

// Resize canvas container and rescale images
function fitCanvasSize() {
  const container = document.getElementById('canvas-container');
  const size = Math.min(window.innerWidth - 40, originalCanvasSize);

  // Calculate scale factor to apply to canvas
  const scaleFactor = size / canvas.getWidth();

  // Resize canvas
  canvas.setWidth(size);
  canvas.setHeight(size);
  container.style.width = ${size}px;

  // Rescale all objects proportionally
  canvas.getObjects().forEach((obj) => {
    obj.scale(obj.scaleX * scaleFactor);
    obj.left *= scaleFactor;
    obj.top *= scaleFactor;
    obj.setCoords();
  });

  canvas.requestRenderAll();
}
window.addEventListener('resize', fitCanvasSize);

// Upload PFP
document.getElementById('upload-image').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (f) => {
    fabric.Image.fromURL(f.target.result, (img) => {
      // Remove previous
      canvas.clear();
      pfpImage = null;
      glassesImage = null;

      // Set base canvas size for layout
      originalCanvasSize = 512;
      canvas.setWidth(originalCanvasSize);
      canvas.setHeight(originalCanvasSize);

      img.set({
        selectable: false,
        hasControls: false,
        hasBorders: false,
        originX: 'center',
        originY: 'center',
        left: canvas.width / 2,
        top: canvas.height / 2
      });

      const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
      img.scale(scale);

      pfpImage = img;
      canvas.add(pfpImage);
      canvas.sendToBack(pfpImage);

      loadGlasses();
      fitCanvasSize();
    });
  };
  reader.readAsDataURL(file);
});

// Load & add glasses overlay
function loadGlasses() {
  fabric.Image.fromURL('assets/intuition-glasses.png', (img) => {
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
    canvas.renderAll();
  });
}

// Reset
document.getElementById('reset-btn').addEventListener('click', () => {
  canvas.clear();
  pfpImage = null;
  glassesImage = null;
  originalCanvasSize = 512;
  canvas.setWidth(originalCanvasSize);
  canvas.setHeight(originalCanvasSize);
  fitCanvasSize();
});

// Download
document.getElementById('download-btn').addEventListener('click', () => {
  if (!pfpImage) return alert("Upload a PFP first.");

  if (glassesImage) {
    glassesImage.set({ hasControls: false, hasBorders: false });
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

  // Restore handles
  if (glassesImage) {
    glassesImage.set({ hasControls: true, hasBorders: true });
  }

  canvas.renderAll();
});

// Mint button
document.getElementById('mint-btn').addEventListener('click', () => {
  alert('🕯 Ritual minted to the void... (fake)');
});

// Initial fit
fitCanvasSize();
