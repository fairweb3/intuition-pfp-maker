const canvas = new fabric.Canvas('editor-canvas', {
  selection: false,
  preserveObjectStacking: true
});

let pfpImage = null;
let glassesImage = null;
let originalSize = 512;

function fitCanvasSize() {
  const container = document.getElementById('canvas-container');
  const newSize = Math.min(window.innerWidth - 40, originalSize);
  if (newSize <= 0) return;

  const scaleFactor = newSize / canvas.getWidth();

  canvas.setWidth(newSize);
  canvas.setHeight(newSize);
  container.style.width = ${newSize}px;

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
      canvas.clear();
      pfpImage = null;
      glassesImage = null;

      canvas.setWidth(originalSize);
      canvas.setHeight(originalSize);

      img.set({
        originX: 'center',
        originY: 'center',
        left: canvas.width / 2,
        top: canvas.height / 2,
        selectable: false,
        hasControls: false,
        hasBorders: false
      });

      const scale = Math.min(
        canvas.width / img.width,
        canvas.height / img.height
      );
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

document.getElementById('reset-btn').addEventListener('click', () => {
  canvas.clear();
  pfpImage = null;
  glassesImage = null;
  canvas.setWidth(originalSize);
  canvas.setHeight(originalSize);
  fitCanvasSize();
});

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

  if (glassesImage) {
    glassesImage.set({ hasControls: true, hasBorders: true });
  }

  canvas.renderAll();
});

document.getElementById('mint-btn').addEventListener('click', () => {
  alert('🕯 Ritual minted to the void... (fake)');
});

fitCanvasSize();
