const colors = [
  "#FAFAFA",
  "#F5F5F5",
  "#EEEEEE",
  "#E0E0E0",
  "#BDBDBD",
  "#9E9E9E",
  "#757575",
  "#616161",
  "#424242",
  "#212121",
].map((color) => {
  return { color };
});

export default {
  title: "material gray",
  key: "material-gray",
  execute: function () {
    return colors;
  },
};
