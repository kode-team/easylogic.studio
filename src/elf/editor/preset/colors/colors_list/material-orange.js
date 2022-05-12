const colors = [
  "#FFF3E0",
  "#FFE0B2",
  "#FFCC80",
  "#FFB74D",
  "#FFA726",
  "#FF9800",
  "#FB8C00",
  "#F57C00",
  "#EF6C00",
  "#E65100",
  "#FFD180",
  "#FFAB40",
  "#FF9100",
  "#FF6D00",
].map((color) => {
  return { color };
});

export default {
  title: "material orange",
  key: "material-orange",
  execute: function () {
    return colors;
  },
};
