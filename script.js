const canvas = new fabric.Canvas('editor-canvas', {
  selection: false,
  preserveObjectStacking: true
});

let pfpImage = null;
let glassesImage = null;

// Resize canvas dynamically to fit container
function fitCanvasSize() {
  const container = document.getElementById('canvas-container');
  const size = Math.min(window.innerWidth - 40, 512);
  canvas.setWidth(size);
  canvas.setHeight(size);
  container.style.width = ${size}px;
}
fitCanvasSize();
window.addEventListener('resize', fitCanvasSize);

// Upload
document.getElementById('upload-image').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (f) => {
    fabric.Image.fromURL(f.target.result, (img) => {
      if (pfpImage) canvas.remove(pfpImage);
      if (glassesImage) canvas.remove(glassesImage);

      img.set({
        selectable: true,
        hasControls: false,
        hasBorders: false,
        lockRotation: true,
        lockScalingFlip: true,
        originX: 'center',
        originY: 'center',
        left: canvas.width / 2,
        top: canvas.height / 2
      });

      // Scale to fit canvas
      const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
      img.scale(scale);

      pfpImage = img;
      canvas.add(pfpImage);
      canvas.sendToBack(pfpImage);

      loadGlasses();
    });
  };
  reader.readAsDataURL(file);
});

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
  });
}

document.getElementById('reset-btn').addEventListener('click', () => {
  canvas.clear();
  pfpImage = null;
  glassesImage = null;
  fitCanvasSize();
});

document.getElementById('download-btn').addEventListener('click', () => {
  if (!pfpImage) return alert("Upload a PFP first.");

  // Hide UI
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

  // Restore UI
  if (glassesImage) {
    glassesImage.set({ hasControls: true, hasBorders: true });
  }
  canvas.renderAll();
});

document.getElementById('mint-btn').addEventListener('click', () => {
  alert('🕯 Ritual minted to the void... (fake)');
});
