export default {
  key: "diagonal-line",
  title: "Diagonal Line",
  execute: function () {
    return [
      {
        pattern: `diagonal-line(10px 10px, 45deg, #B7C4CD, white, normal, 1px)`,
      },
      {
        pattern: `diagonal-line(25px 25px, 90deg, #DDB104, #FEF0BC, normal, 2px)`,
      },
      {
        pattern: `diagonal-line(50px 50px, 135deg, #35DB92, #DCF9EC, normal, 3px)`,
      },
    ];
  },
};
