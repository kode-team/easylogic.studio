export default [
  {
    type: "SourceAlpha",
    id: "shadowSource",
    bound: { x: 100, y: 100 },
    connected: [
      {
        id: "offset",
      },
    ],
  },

  {
    type: "Offset",
    id: "offset",
    bound: { x: 200, y: 100 },
    dx: 10,
    dy: 10,
    in: [{ id: "shadowSource" }],
    connected: [{ id: "blur" }],
  },

  {
    type: "GaussianBlur",
    id: "blur",
    bound: { x: 300, y: 100 },
    stdDeviationX: 5,
    stdDeviationY: 5,
    in: [{ id: "offset" }],
    connected: [
      {
        id: "composite",
      },
    ],
  },

  {
    type: "Flood",
    id: "flood",
    bound: { x: 100, y: 200 },
    color: "black",
    opacity: 0.7,
    connected: [{ id: "composite" }],
  },

  {
    type: "Composite",
    id: "composite",
    bound: { x: 400, y: 150 },
    in: [{ id: "flood" }, { id: "blur" }],
    operator: "in",
    connected: [
      {
        id: "merge",
      },
    ],
  },

  {
    type: "SourceAlpha",
    id: "shadowSource2",
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
    in: [{ id: "composite" }, { id: "shadowSource2" }],
  },
];
