const colors = [
  "#e3f2fd",
  "#bbdefb",
  "#90caf9",
  "#64b5f6",
  "#42a5f5",
  "#2196f3",
  "#1e88e5",
  "#1976d2",
  "#1565c0",
  "#0d47a1",
  "#2196f3",
  "#82b1ff",
  "#448aff",
  "#2979ff",
  "#2962ff",
].map((color) => {
  return { color };
});

export default {
  title: "material blue",
  key: "material-blue",
  execute: function () {
    return colors;
  },
};
