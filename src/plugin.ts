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

  console.log("MESSAGE:", message);

  if (message.type === "generate-noise") {
    penpot
      .uploadMediaData("noise-data", message.data, "image/jpeg")
      .then(() => {
        console.log("done");
      })
      .catch((e) => {
        console.log(e);
      });
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
