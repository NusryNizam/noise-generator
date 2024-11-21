penpot.ui.open("Noisyy", `?theme=${penpot.theme}`, {
  width: 360,
  height: 800,
});

penpot.ui.onMessage<{
  type: string;
  data: any;
}>((message) => {
  if (message.type === "create-text") {
    const text = penpot.createText("Hello world!");

    if (text) {
      text.x = penpot.viewport.center.x;
      text.y = penpot.viewport.center.y;

      penpot.selection = [text];
    }
  }

  if (message.type === "generate-noise") {
    addToCanvas(message.data);
  }
});

// Update the theme in the iframe
penpot.on("themechange", (theme) => {
  penpot.ui.sendMessage({
    source: "penpot",
    type: "themechange",
    theme,
  });
});

async function addToCanvas(data: {
  buffer: Uint8Array;
  width: number;
  height: number;
}) {
  const image = await penpot.uploadMediaData(
    "generated-noise",
    data.buffer,
    "image/png"
  );

  if (image) {
    penpot.ui.sendMessage({ type: "image-success" });
  }

  const rect = penpot.createRectangle();
  rect.x = penpot.viewport.center.x;
  rect.y = penpot.viewport.center.y;
  rect.resize(data.width, data.height);
  rect.fills = [{ fillOpacity: 1, fillImage: image }];
}
