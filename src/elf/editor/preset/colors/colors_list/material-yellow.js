const colors = [
  "#FFFDE7",
  "#FFF9C4",
  "#FFF59D",
  "#FFF176",
  "#FFEE58",
  "#FFEB3B",
  "#FDD835",
  "#FBC02D",
  "#F9A825",
  "#F57F17",
  "#FFFF8D",
  "#FFFF00",
  "#FFEA00",
  "#FFD600",
].map((color) => {
  return { color };
});

export default {
  title: "material yellow",
  key: "material-yellow",
  execute: function () {
    return colors;
  },
};
