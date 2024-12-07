const editor = document.getElementById("editor");
const saveButton = document.getElementById("save");
saveButton.addEventListener("click", generateLink);
const test = document.getElementById("test");
test.addEventListener("click", load);

window.addEventListener("hashchange", () => {
  console.log("hash changed", window.location.hash);
  load();
});

editor.addEventListener("keydown", (e) => {

  // handle tab input
  if (e.key === "Tab") {
    e.preventDefault();
    editor.setRangeText(
      "\t",
      editor.selectionStart,
      editor.selectionStart,
      "end"
    );
  }
  
  // handle ctrl+S hotkey
  if (e.key === "s" && (e.ctrlKey || e.metaKey)) {
    e.preventDefault();
    generateLink();
  }
});

async function generateLink() {
  // original data
  const data = {
    text: editor.value,
  };
  const dataString = JSON.stringify(data);
  console.log(dataString);

  // compress the string using gzip
  const compressedData = pako.gzip(dataString);

  // convert Uint8Array to binary string
  let binaryString = "";
  for (let i = 0; i < compressedData.length; i++) {
    binaryString += String.fromCharCode(compressedData[i]);
  }

  // encode binary string to base64
  const base64String = btoa(binaryString);

  // convert to link and navigate to new link
  const link = window.location.pathname + "#" + base64String;

  console.log(link);
  window.location.assign(link);
  try {
    await navigator.clipboard.writeText(window.location.href);
    // TODO: show toast popup
    console.log("copied url!");
    console.log("TODO: show toast popup");
  } catch (err) {
    console.error(err);
  }
}

async function load() {
  // TODO: add error checking

  // decode base64 string to binary string
  const decodedBinaryString = atob(window.location.hash.substring(1));

  // convert binary string to Uint8Array
  const len = decodedBinaryString.length;
  const decodedBytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    decodedBytes[i] = decodedBinaryString.charCodeAt(i);
  }

  // decompress the gzip data
  const decompressedData = pako.ungzip(decodedBytes, { to: "string" });
  console.log("Decompressed String:", decompressedData);

  // retrieve original json object
  const data = JSON.parse(decompressedData);

  // put text into editor
  editor.value = data.text;
}
