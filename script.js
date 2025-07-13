// script.js

const canvas = new fabric.Canvas("c", {
  preserveObjectStacking: true,
  backgroundColor: "#111",
});

let uploadedImg = null;
let glassesImg = null;

function scaleToFit(img, targetWidth, targetHeight) {
  const scaleX = targetWidth / img.width;
  const scaleY = targetHeight / img.height;
  return Math.min(scaleX, scaleY);
}

document.getElementById("upload").addEventListener("change", function (e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (f) {
    fabric.Image.fromURL(f.target.result, function (img) {
      if (uploadedImg) canvas.remove(uploadedImg);
      uploadedImg = img;

      // Fit image to canvas area (contain)
      const scale = scaleToFit(img, canvas.getWidth(), canvas.getHeight());
      img.scale(scale);
      img.set({
        left: canvas.getWidth() / 2,
        top: canvas.getHeight() / 2,
        originX: "center",
        originY: "center",
        selectable: true,
        hasBorders: false,
        hasControls: false,
      });
      canvas.add(img);
      canvas.sendToBack(img);
      canvas.renderAll();
    });
  };
  reader.readAsDataURL(file);
});

document.getElementById("add-glasses").addEventListener("click", function () {
  if (glassesImg) {
    canvas.remove(glassesImg);
    glassesImg = null;
    canvas.renderAll();
  }

  fabric.Image.fromURL("assets/intuition-glasses.png", function (img) {
    glassesImg = img;
    glassesImg.set({
      left: canvas.getWidth() / 2,
      top: canvas.getHeight() / 2,
      originX: "center",
      originY: "center",
      hasRotatingPoint: true,
    });

    glassesImg.scale(0.5);
    canvas.add(glassesImg);
    canvas.setActiveObject(glassesImg);
    canvas.renderAll();
  });
});

document.getElementById("reset").addEventListener("click", function () {
  canvas.clear();
  canvas.backgroundColor = "#111";
  uploadedImg = null;
  glassesImg = null;
});

document.getElementById("download").addEventListener("click", function () {
  if (!uploadedImg) return;

  // Create temp canvas with same size as original uploaded image
  const exportCanvas = new fabric.StaticCanvas(null, {
    width: uploadedImg.getScaledWidth(),
    height: uploadedImg.getScaledHeight(),
  });

  const cloneItems = canvas.getObjects().map((obj) => {
    const clone = fabric.util.object.clone(obj);
    const scale = uploadedImg.getScaledWidth() / canvas.getWidth();
    clone.scale(clone.scaleX * scale);
    clone.left = (clone.left - canvas.getWidth() / 2) * scale + uploadedImg.getScaledWidth() / 2;
    clone.top = (clone.top - canvas.getHeight() / 2) * scale + uploadedImg.getScaledHeight() / 2;
    return clone;
  });

  exportCanvas.add(...cloneItems);
  exportCanvas.renderAll();

  const link = document.createElement("a");
  link.href = exportCanvas.toDataURL({
    format: "png",
    enableRetinaScaling: true,
  });
  link.download = "intuition-pfp.png";
  link.click();
});
