const colors = [
  "#F9FBE7",
  "#F0F4C3",
  "#E6EE9C",
  "#DCE775",
  "#D4E157",
  "#CDDC39",
  "#C0CA33",
  "#AFB42B",
  "#9E9D24",
  "#827717",
  "#F4FF81",
  "#EEFF41",
  "#C6FF00",
  "#AEEA00",
].map((color) => {
  return { color };
});

export default {
  title: "material lime",
  key: "material-lime",
  execute: function () {
    return colors;
  },
};
