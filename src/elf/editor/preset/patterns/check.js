export default {
  key: "check",
  title: "Check",
  execute: function () {
    return [
      { pattern: `check(20px 20px, 10px 10px, black, transparent)` },
      { pattern: `check(40px 40px, 20px 20px, black, transparent)` },
      { pattern: `check(60px 60px, 30px 30px, #DDB104, rgba(254,240,188,0))` },
      { pattern: `check(80px 80px, 40px 40px, #DDB104, rgba(254,240,188,0))` },
      { pattern: `check(100px 100px, 50px 50px, #DCF3DC, transparent)` },
      { pattern: `check(200px 200px, 100px 100px, #102C45, transparent)` },
    ];
  },
};
