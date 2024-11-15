import "./style.css";

// get the current theme from the URL
const searchParams = new URLSearchParams(window.location.search);
document.body.dataset.theme = searchParams.get("theme") ?? "light";

document
  .querySelector("[data-handler='create-text']")
  ?.addEventListener("click", () => {
    // send message to plugin.ts
    parent.postMessage("create-text", "*");
  });

// Listen plugin.ts messages
window.addEventListener("message", (event) => {
  if (event.data.source === "penpot") {
    document.body.dataset.theme = event.data.theme;
  }
});

const widthInput = document.getElementById("width") as HTMLInputElement;
const heightInput = document.getElementById("height") as HTMLInputElement;
const scaleInput = document.getElementById("scale") as HTMLInputElement;
const noiseType = document.getElementById(
  "gradient-type-select"
) as HTMLInputElement;
const intensityInput = document.getElementById("intensity") as HTMLInputElement;
const pixelStepInput = document.getElementById(
  "pixel-step"
) as HTMLInputElement;
const canvas = document.getElementById("noiseCanvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;

const scaleValue = document.getElementById("scale-value")!;
const intensityValue = document.getElementById("intensity-value")!;
const pixelStepValue = document.getElementById("pixel-step-value")!;

noiseType.onselect = () => {
  // noiseType.textContent = "abc";
};

// Update displayed scale and intensity values
scaleInput.oninput = () => {
  scaleValue.textContent =
    Number(scaleInput.value) > 100 ? "100" : scaleInput.value;
  generateNoise();
};
intensityInput.oninput = () => {
  intensityValue.textContent =
    Number(intensityInput.value) > 255 ? "255" : intensityInput.value;

  generateNoise();
};

pixelStepInput.oninput = () => {
  pixelStepValue.textContent = pixelStepInput.value;
  generateNoise();
};

widthInput.oninput = generateNoise;
heightInput.oninput = generateNoise;

function generateNoise() {
  const width = parseInt(
    Number(widthInput.value) > 2000 ? "2000" : widthInput.value
  );
  const height = parseInt(
    Number(heightInput.value) > 2000 ? "2000" : heightInput.value
  );
  const scale = parseFloat(scaleInput.value);
  const intensity = parseFloat(intensityInput.value);
  const pixelStep = parseInt(pixelStepInput.value);

  generateWhiteNoise(width, height, scale, intensity, pixelStep);
}

function generateWhiteNoise(
  width: number,
  height: number,
  scale: number,
  intensity: number,
  pixelStep: number
) {
  canvas.width = width;
  canvas.height = height;
  const imageData = ctx.createImageData(width, height);

  for (let i = 0; i < imageData.data.length; i += pixelStep) {
    const randomValue = (Math.random() * 255 * intensity) / 255;
    const scaledValue = (randomValue * scale) / 100;

    imageData.data[i] = scaledValue; // Red
    imageData.data[i + 1] = scaledValue; // Green
    imageData.data[i + 2] = scaledValue; // Blue
    imageData.data[i + 3] = 255; // Alpha
  }

  ctx.putImageData(imageData, 0, 0);
}

// Initial generation
generateNoise();
