export default [
  {
    category: "Web",
    groups: [
      {
        group: "Landscape",
        devices: [
          { device: "Web Small", size: "1024x600" },
          { device: "Web Medium", size: "1280x800" },
          { device: "Web Large", size: "1440x900" },
          { device: "Web X Large", size: "1920x1200" },
        ],
      },
      {
        group: "Portrait",
        devices: [
          { device: "Web Small", size: "600x1024" },
          { device: "Web Medium", size: "800x1280" },
          { device: "Web Large", size: "900x1440" },
          { device: "Web X Large", size: "1200x1920" },
        ],
      },
    ],
  },
  {
    category: "Apple Devices",
    groups: [
      {
        group: "iphone",
        devices: [
          { device: "iPhone 8", size: "375x667" },
          { device: "iPhone 8 Plus", size: "414x736" },
          { device: "iPhone SE", size: "320x568" },
          { device: "iPhone XS", size: "375x812" },
          { device: "iPhone XR", size: "414x896" },
          { device: "iPhone XS Max", size: "414x896" },
        ],
      },
      {
        group: "ipad",
        devices: [
          { device: "iPad", size: "768x1024" },
          { device: "iPad Pro", size: "1024x1366" },
        ],
      },
      {
        group: "apple watch",
        devices: [
          { device: "Apple Watch 38nm", size: "272x340" },
          { device: "Apple Watch 40nm", size: "326x394" },
          { device: "Apple Watch 42nm", size: "313x390" },
          { device: "Apple Watch 44nm", size: "368x448" },
        ],
      },
      {
        group: "apple tv",
        devices: [{ device: "Apple TV", size: "1920x1080" }],
      },
      { group: "MAC", devices: [{ device: "Touch Bar", size: "1085x30" }] },
    ],
  },
  {
    category: "Android Devices",
    groups: [
      {
        group: "android mobile",
        devices: [{ device: "Android Mobile", size: "360x640" }],
      },
      {
        group: "android tablet",
        devices: [{ device: "Android Tablet", size: "768x1024" }],
      },
    ],
  },
];
