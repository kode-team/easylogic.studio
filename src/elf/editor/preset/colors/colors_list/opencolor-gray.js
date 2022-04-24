const colors = [
  "#f8f9fa",
  "#f1f3f5",
  "#e9ecef",
  "#dee2e6",
  "#ced4da",
  "#adb5bd",
  "#868e96",
  "#495057",
  "#343a40",
  "#212529",
].map((color) => {
  return { color };
});

export default {
  title: "opencolor gray",
  resource: "https://yeun.github.io/open-color/",
  key: "opencolor-gray",
  execute: function () {
    return colors;
  },
};
