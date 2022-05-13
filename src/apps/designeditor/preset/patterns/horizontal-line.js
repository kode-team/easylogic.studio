export default {
  key: "horizontal-line",
  title: "Horizontal Line",
  execute: function () {
    return [
      { pattern: `horizontal-line(10px 10px, 0, #B7C4CD, white, normal, 1px)` },
      {
        pattern: `horizontal-line(25px 25px, 0, #DDB104, #FEF0BC, normal, 2px)`,
      },
      {
        pattern: `horizontal-line(50px 50px, 0, #35DB92, #DCF9EC, normal, 3px)`,
      },
    ];
  },
};
