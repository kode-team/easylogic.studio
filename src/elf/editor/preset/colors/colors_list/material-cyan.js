const colors = [
  "#e0f7fa",
  "#b2ebf2",
  "#80deea",
  "#4dd0e1",
  "#26c6da",
  "#00bcd4",
  "#00acc1",
  "#0097a7",
  "#00838f",
  "#006064",
  "#00bcd4",
  "#84ffff",
  "#18ffff",
  "#00e5ff",
  "#00b8d4",
].map((color) => {
  return { color };
});

export default {
  title: "material cyan",
  key: "material-cyan",
  execute: function () {
    return colors;
  },
};
