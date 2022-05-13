const colors = [
  "#f3e5f5",
  "#e1bee7",
  "#ce93d8",
  "#ba68c8",
  "#ab47bc",
  "#9c27b0",
  "#8e24aa",
  "#7b1fa2",
  "#6a1b9a",
  "#4a148c",
  "#9c27b0",
  "#ea80fc",
  "#e040fb",
  "#d500f9",
  "#aa00ff",
].map((color) => {
  return { color };
});

export default {
  title: "material purple",
  key: "material-purple",
  execute: function () {
    return colors;
  },
};
