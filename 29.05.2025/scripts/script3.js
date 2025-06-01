let cssStyles = [
  { name: "color", value: "blue" },
  { name: "font-size", value: "20px" },
  { name: "text-align", value: "center" },
  { name: "text-decoration", value: "underline" }
];

function writeStyledText(styles, text) {
  let styleString = styles.map(s => `${s.name}:${s.value}`).join(";");
  document.write(`<p style="${styleString}">${text}</p>`);
}
