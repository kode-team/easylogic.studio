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
    in: [{ id: "composite" }, { id: "strokeSourceGraphic" }],
  },
];
