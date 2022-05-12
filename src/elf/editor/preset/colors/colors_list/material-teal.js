const colors = [
  "#e0f2f1",
  "#b2dfdb",
  "#80cbc4",
  "#4db6ac",
  "#26a69a",
  "#009688",
  "#00897b",
  "#00796b",
  "#00695c",
  "#004d40",
  "#009688",
  "#a7ffeb",
  "#64ffda",
  "#1de9b6",
  "#00bfa5",
].map((color) => {
  return { color };
});

export default {
  title: "material teal",
  key: "material-teal",
  execute: function () {
    return colors;
  },
};
