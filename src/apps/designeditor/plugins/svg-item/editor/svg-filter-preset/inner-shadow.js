export default [
  {
    type: "Flood",
    id: "flood",
    bound: { x: 100, y: 200 },
    color: "black",
    opacity: 1,
    connected: [{ id: "composite1" }],
  },

  {
    type: "SourceAlpha",
    id: "shadowSource",
    bound: { x: 100, y: 100 },
    connected: [
      {
        id: "composite1",
      },
    ],
  },

  {
    type: "Composite",
    id: "composite1",
    bound: { x: 200, y: 150 },
    in: [{ id: "flood" }, { id: "shadowSource" }],
    operator: "out",
    connected: [
      {
        id: "offset",
      },
    ],
  },

  {
    type: "Offset",
    id: "offset",
    bound: { x: 300, y: 150 },
    dx: 4,
    dy: 4,
    in: [{ id: "composite1" }],
    connected: [{ id: "blur" }],
  },

  {
    type: "GaussianBlur",
    id: "blur",
    bound: { x: 400, y: 150 },
    stdDeviationX: 4,
    stdDeviationY: 4,
    edge: "none",
    in: [{ id: "offset" }],
    connected: [
      {
        id: "composite2",
      },
    ],
  },

  {
    type: "SourceAlpha",
    id: "shadowSource2",
    bound: { x: 400, y: 250 },
    connected: [
      {
        id: "composite2",
      },
    ],
  },

  {
    type: "Composite",
    id: "composite2",
    bound: { x: 500, y: 150 },
    in: [{ id: "blur" }, { id: "shadowSource2" }],
    operator: "out",
    connected: [
      {
        id: "merge",
      },
    ],
  },

  {
    type: "SourceGraphic",
    id: "shadowSource3",
    bound: { x: 500, y: 250 },
    connected: [
      {
        id: "merge",
      },
    ],
  },

  {
    type: "Merge",
    id: "merge",
    bound: { x: 600, y: 150 },
    in: [{ id: "composite2" }, { id: "shadowSource3" }],
  },
];
