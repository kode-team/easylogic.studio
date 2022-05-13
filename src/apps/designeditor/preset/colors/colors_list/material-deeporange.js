const colors = [
  "#FBE9E7",
  "#FFCCBC",
  "#FFAB91",
  "#FF8A65",
  "#FF7043",
  "#FF5722",
  "#F4511E",
  "#E64A19",
  "#D84315",
  "#BF360C",
  "#FF9E80",
  "#FF6E40",
  "#FF3D00",
  "#DD2C00",
].map((color) => {
  return { color };
});

export default {
  title: "material deep orange",
  key: "material-deeporange",
  execute: function () {
    return colors;
  },
};
