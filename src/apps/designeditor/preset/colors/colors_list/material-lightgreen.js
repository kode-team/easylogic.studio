const colors = [
  "#F1F8E9",
  "#DCEDC8",
  "#C5E1A5",
  "#AED581",
  "#9CCC65",
  "#8BC34A",
  "#7CB342",
  "#689F38",
  "#558B2F",
  "#33691E",
  "#CCFF90",
  "#B2FF59",
  "#76FF03",
  "#64DD17",
].map((color) => {
  return { color };
});

export default {
  title: "material lightgreen",
  key: "material-lightgreen",
  execute: function () {
    return colors;
  },
};
