export default {
  key: "polygon",
  title: "Polygon",
  execute: function () {
    return [
      { name: "Triangle", polygon: "50% 0%, 0% 100%, 100% 100%" },
      { name: "Trapezoid", polygon: "20% 0%, 80% 0%, 100% 100%, 0% 100%" },
      {
        name: "Parallelogram",
        polygon: "25% 0%, 100% 0%, 75% 100%, 0% 100%",
      },
      {
        name: "Rhombus",
        polygon: "50% 0%, 100% 50%, 50% 100%, 0% 50%",
      },
      {
        name: "Pentagon",
        polygon: "50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%",
      },
      {
        name: "Hexagon",
        polygon: "50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%",
      },
      {
        name: "Heptagon",
        polygon:
          "50% 0%, 90% 20%, 100% 60%, 75% 100%, 25% 100%, 0% 60%, 10% 20%",
      },

      {
        name: "Octagon",
        polygon:
          "30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%",
      },
    ];
  },
};
