export default [
  {
    type: "SourceAlpha",
    id: "strokeSource",
    bound: { x: 100, y: 100 },
    connected: [
      {
        id: "morphology",
      },
    ],
  },

  {
    type: "Morphology",
    id: "morphology",
    operator: "dilate",
    radius: "3 3",
    bound: { x: 100, y: 200 },
    in: [{ id: "strokeSource" }],
    connected: [{ id: "composite" }],
  },

  {
    type: "Flood",
    id: "flood",
    bound: { x: 100, y: 200 },
    color: "#30597E",
    opacity: 1,
    connected: [{ id: "composite" }],
  },

  {
    type: "Composite",
    id: "composite",
    bound: { x: 400, y: 150 },
    in: [{ id: "flood" }, { id: "morphology" }],
    operator: "in",
    connected: [
      {
        id: "composite2",
      },
    ],
  },

  {
    type: "SourceAlpha",
    id: "strokeSourceAlpha2",
    bound: { x: 400, y: 200 },
    connected: [
      {
        id: "composite2",
      },
    ],
  },

  {
    type: "Composite",
    id: "composite2",
    bound: { x: 400, y: 150 },
    in: [{ id: "composite" }, { id: "strokeSourceAlpha2" }],
    operator: "out",
    connected: [
      {
        id: "displacementMap",
      },
    ],
  },

  {
    type: "Turbulence",
    id: "turbulence",
    filterType: "fractalNoise",
    baseFrequency: "0.01 0.02",
    numOctaves: 1,
    seed: 0,
    stitchTiles: "stitch",
    bound: { x: 400, y: 200 },
    connected: [
      {
        id: "displacementMap",
      },
    ],
  },

  {
    type: "DisplacementMap",
    id: "displacementMap",
    scale: 17,
    xChannelSelector: "A",
    yChannelSelector: "A",
    bound: { x: 400, y: 200 },
    in: [{ id: "composite2" }, { id: "turbulence" }],
    connected: [
      {
        id: "merge",
      },
    ],
  },

  {
    type: "SourceGraphic",
    id: "strokeSourceGraphic",
    bound: { x: 400, y: 200 },
    connected: [
      {
        id: "merge",
      },
    ],
  },

  {
    type: "Merge",
    id: "merge",
    bound: { x: 500, y: 150 },
    in: [{ id: "strokeSourceGraphic" }, { id: "displacementMap" }],
  },
];
