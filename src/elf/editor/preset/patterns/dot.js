export default {
  key: "dot",
  title: "Dot",
  execute: function () {
    return [
      { pattern: `dot(20px 20px, 10px 10px, #B7C4CD, white, normal, 1px)` },
      { pattern: `dot(40px 40px, 20px 20px, #E7393F, #FEF0BC, normal, 2px)` },
      { pattern: `dot(60px 60px, 30px 30px, #E7393F, black, normal, 3px)` },
      { pattern: `dot(80px 80px, 40px 40px, #B7C4CD, white, normal, 4px)` },
    ];
  },
};
