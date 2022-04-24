const colors = [
  "#fce4ec",
  "#f8bbd0",
  "#f48fb1",
  "#f06292",
  "#ec407a",
  "#e91e63",
  "#d81b60",
  "#c2185b",
  "#ad1457",
  "#880e4f",
  "#e91e63",
  "#ff80ab",
  "#ff4081",
  "#f50057",
  "#c51162",
].map((color) => {
  return { color };
});

export default {
  title: "material pink",
  key: "material-pink",
  execute: function () {
    return colors;
  },
};
