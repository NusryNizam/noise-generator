import { createNoise2D } from "simplex-noise";
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

noiseType.onchange = () => {
  generateNoise();
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

  if (noiseType.value === "white") {
    return generateWhiteNoise(width, height, scale, intensity, pixelStep);
  }

  if (noiseType.value === "perlin") {
    return generatePerlinNoise();
  }
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

function generatePerlinNoise() {
  const width = parseInt(widthInput.value);
  const height = parseInt(heightInput.value);
  const scale = parseFloat(scaleInput.value);
  const intensity = parseFloat(intensityInput.value);
  const pixelStep = parseInt(pixelStepInput.value);
  const noise2D = createNoise2D();

  canvas.width = width;
  canvas.height = height;

  const imageData = ctx.createImageData(width, height);

  for (let x = 0; x < width; x += pixelStep) {
    for (let y = 0; y < height; y += pixelStep) {
      // Generate Perlin noise value, scaled by the `scale` factor
      const value = (noise2D(x / scale, y / scale) + 1) * (intensity / 2); // Scale noise to 0-255 range
      const index = (x + y * width) * 4;
      imageData.data[index] = value; // Red
      imageData.data[index + 1] = value; // Green
      imageData.data[index + 2] = value; // Blue
      imageData.data[index + 3] = 255; // Alpha
    }
  }

  ctx.putImageData(imageData, 0, 0);
}
