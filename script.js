const canvas = new fabric.Canvas('editor-canvas', {
  preserveObjectStacking: true
});

let pfpImage = null;
let glassesImage = null;

function fitCanvasContainer() {
  const container = document.getElementById('canvas-container');
  const maxSize = Math.min(window.innerWidth - 40, 512);
  container.style.width = ${maxSize}px;
}
fitCanvasContainer();
window.addEventListener('resize', fitCanvasContainer);

document.getElementById('upload-image').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (f) {
    fabric.Image.fromURL(f.target.result, function (img) {
      canvas.clear();
      pfpImage = null;
      glassesImage = null;

      const aspectRatio = img.width / img.height;
      let width = 512;
      let height = Math.round(512 / aspectRatio);

      if (height > 512) {
        height = 512;
        width = Math.round(512 * aspectRatio);
      }

      canvas.setWidth(width);
      canvas.setHeight(height);

      img.set({
        originX: 'center',
        originY: 'center',
        left: width / 2,
        top: height / 2,
        selectable: true,
        hasControls: false,
        hasBorders: false
      });

      const scale = Math.min(width / img.width, height / img.height);
      img.scale(scale);

      pfpImage = img;
      canvas.add(pfpImage);
      canvas.sendToBack(pfpImage);

      loadGlasses(width, height);
    });
  };
  reader.readAsDataURL(file);
});

function loadGlasses(width, height) {
  fabric.Image.fromURL('assets/intuition-glasses.png', function (img) {
    img.set({
      originX: 'center',
      originY: 'center',
      left: width / 2,
      top: height / 2,
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
  canvas.setWidth(512);
  canvas.setHeight(512);
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
    multiplier: 3 // High quality
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
