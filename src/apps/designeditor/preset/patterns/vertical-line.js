export default {
  key: "vertical-line",
  title: "Vertical Line",
  execute: function () {
    return [
      { pattern: `vertical-line(10px 10px, 0px, #B7C4CD, white, normal, 1px)` },
      {
        pattern: `vertical-line(25px 25px, 0px, #DDB104, #FEF0BC, normal, 2px)`,
      },
      {
        pattern: `vertical-line(50px 50px, 0px, black, rgba(231,57,63,0.9), normal, 1px)`,
      },
    ];
  },
};
