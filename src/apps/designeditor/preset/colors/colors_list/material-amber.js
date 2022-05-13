const colors = [
  "#FFF8E1",
  "#FFECB3",
  "#FFE082",
  "#FFD54F",
  "#FFCA28",
  "#FFC107",
  "#FFB300",
  "#FFA000",
  "#FF8F00",
  "#FF6F00",
  "#FFE57F",
  "#FFD740",
  "#FFC400",
  "#FFAB00",
].map((color) => {
  return { color };
});

export default {
  title: "material amber",
  key: "material-amber",
  execute: function () {
    return colors;
  },
};
