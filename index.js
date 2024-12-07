// reload content on page load and on hash change
window.addEventListener("DOMContentLoaded", load);
window.addEventListener("hashchange", load);

// text editor HTML element
const editor = document.getElementById("editor");

// save button HTML element
const saveButton = document.getElementById("save");
saveButton.addEventListener("click", generateLink);

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
  try {
    await navigator.clipboard.writeText(window.location.href);
    // TODO: show toast popup
    console.log("Copied URL to clipboard! TODO: show toast popup");
  } catch (err) {
    console.error(err);
  }
}

//
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
