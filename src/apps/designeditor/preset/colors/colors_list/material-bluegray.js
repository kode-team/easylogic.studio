const colors = [
  "#ECEFF1",
  "#CFD8DC",
  "#B0BEC5",
  "#90A4AE",
  "#78909C",
  "#607D8B",
  "#546E7A",
  "#455A64",
  "#37474F",
  "#263238",
].map((color) => {
  return { color };
});

export default {
  title: "material bluegray",
  key: "material-bluegray",
  execute: function () {
    return colors;
  },
};
