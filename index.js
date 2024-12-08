import showToast from "./toast.js";

// reload content on page load and on hash change
window.addEventListener("DOMContentLoaded", () => {
  load();
  editor.selectionEnd = 0;
  updateSize();
});
window.addEventListener("hashchange", load);

// text editor HTML element
const editor = document.getElementById("editor");

// save button HTML element
const saveButton = document.getElementById("save");
saveButton.addEventListener("click", generateLink);

// information about text
const positionText = document.getElementById("position");
const sizeText = document.getElementById("size");

// handle caret move
editor.addEventListener("selectionchange", () => {
  updatePosition();
});

// handle typing normal characters
editor.addEventListener("input", (e) => {
  updateSize();
});

// handle special keys in editor
editor.addEventListener("keydown", (e) => {
  // console.log("keydown event", e.key);
  // handle tab input
  if (e.key === "Tab") {
    e.preventDefault();
    editor.setRangeText(
      "\t",
      editor.selectionStart,
      editor.selectionEnd,
      "end"
    );
    updateSize();
  }

  // handle ctrl+S hotkey
  if (e.key === "s" && (e.ctrlKey || e.metaKey)) {
    e.preventDefault();
    generateLink();
  }
});

// update size display in ui
function updateSize() {
  sizeText.innerHTML = `${editor.value.length}B`;
}

// update cursor position display in ui
function updatePosition() {
  // get line and column of cursor
  // console.log(
  //   "update position... cur selection:",
  //   editor.selectionStart,
  //   editor.selectionEnd
  // );
  let line = 1;
  let col = 1;

  for (let i = 0; i < editor.selectionEnd; i++) {
    // console.log(editor.value.charCodeAt(i));
    if (editor.value[i] === "\n") {
      line += 1;
      col = 1;
    } else if (editor.value[i] === "\t") {
      col += 4;
      col -= (col - 1) % 4;
    } else {
      col += 1;
    }
  }
  // console.log(editor.value);
  // console.log("line", line, "col", col);
  positionText.innerHTML = `ln ${line}, col ${col}`;
}

// generate share link and navigate to it
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

  // copy to clipboard
  try {
    await navigator.clipboard.writeText(window.location.href);
    console.log("asd");
    showToast("Copied URL to clipboard!");
  } catch (err) {
    console.error(err);
  }
}

// load from link
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
