const editor = document.getElementById("editor");
const saveButton = document.getElementById("save");
saveButton.addEventListener("click", generateLink);
const test = document.getElementById("test");
test.addEventListener("click", load);

async function generateLink() {
  const data = {
    text: editor.value,
    color: "blue?",
    otherInfo: "idk",
  };

  const jsonString = JSON.stringify(data);

  const encoder = new TextEncoder();
  const encodedJson = encoder.encode(jsonString);

  const jsonStream = new ReadableStream({
    start(controller) {
      controller.enqueue(encodedJson);
      controller.close();
    },
  });

  const compressionStream = new CompressionStream("gzip");
  const compressedStream = jsonStream.pipeThrough(compressionStream);

  const reader = compressedStream.getReader();

  var result = "";
  while (true) {
    const { done, value } = await reader.read();
    result += value;
    if (done) {
      const link = btoa(result);
      console.log(
        window.location.hostname +
          ":" +
          window.location.port +
          window.location.pathname +
          "#" +
          link
      );
      return link;
    }
  }
}

async function load() {
  const compressedData = atob(window.location.hash.substring(1));
  console.log(compressedData);
}
