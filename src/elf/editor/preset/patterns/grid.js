export default {
  key: "grid",
  title: "Grid",
  execute: function () {
    return [
      { pattern: `grid(20px 20px, 10px 10px, black, transparent)` },
      { pattern: `grid(40px 40px, 20px 20px, black, transparent)` },
      { pattern: `grid(60px 60px, 30px 30px, #DDB104, rgba(254,240,188,0))` },
      { pattern: `grid(80px 80px, 40px 40px, #DDB104, rgba(254,240,188,0))` },
      { pattern: `grid(100px 100px, 50px 50px, #DCF3DC, transparent)` },
      { pattern: `grid(200px 200px, 100px 100px, #102C45, transparent)` },
    ];
  },
};
