const colors = [
  "#EFEBE9",
  "#D7CCC8",
  "#BCAAA4",
  "#A1887F",
  "#8D6E63",
  "#795548",
  "#6D4C41",
  "#5D4037",
  "#4E342E",
  "#3E2723",
].map((color) => {
  return { color };
});

export default {
  title: "material brown",
  key: "material-brown",
  execute: function () {
    return colors;
  },
};
