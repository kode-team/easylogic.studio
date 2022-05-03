const colors = [
  "#E8F5E9",
  "#C8E6C9",
  "#A5D6A7",
  "#81C784",
  "#66BB6A",
  "#4CAF50",
  "#43A047",
  "#388E3C",
  "#2E7D32",
  "#1B5E20",
  "#B9F6CA",
  "#69F0AE",
  "#00E676",
  "#00C853",
].map((color) => {
  return { color };
});

export default {
  title: "material green",
  key: "material-green",
  execute: function () {
    return colors;
  },
};
