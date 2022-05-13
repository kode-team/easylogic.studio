const colors = [
  "#ffebee",
  "#ffcdd2",
  "#ef9a9a",
  "#e57373",
  "#ef5350",
  "#f44336",
  "#e53935",
  "#d32f2f",
  "#c62828",
  "#b71c1c",
  "#f44336",
  "#ff8a80",
  "#ff5252",
  "#ff1744",
  "#d50000",
].map((color) => {
  return { color };
});

export default {
  title: "material red",
  key: "material-red",
  execute: function () {
    return colors;
  },
};
