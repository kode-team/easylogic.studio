const colors = [
  "#e8eaf6",
  "#c5cae9",
  "#9fa8da",
  "#7986cb",
  "#5c6bc0",
  "#3f51b5",
  "#3949ab",
  "#303f9f",
  "#283593",
  "#1a237e",
  "#3f51b5",
  "#8c9eff",
  "#536dfe",
  "#3d5afe",
  "#304ffe",
].map((color) => {
  return { color };
});

export default {
  title: "material indigo",
  key: "material-indigo",
  execute: function () {
    return colors;
  },
};
