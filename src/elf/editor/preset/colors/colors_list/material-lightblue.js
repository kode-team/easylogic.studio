const colors = [
  "#e1f5fe",
  "#b3e5fc",
  "#81d4fa",
  "#4fc3f7",
  "#29b6f6",
  "#03a9f4",
  "#039be5",
  "#0288d1",
  "#0277bd",
  "#01579b",
  "#03a9f4",
  "#80d8ff",
  "#40c4ff",
  "#00b0ff",
  "#0091ea",
].map((color) => {
  return { color };
});

export default {
  title: "material light blue",
  key: "material-lightblue",
  execute: function () {
    return colors;
  },
};
