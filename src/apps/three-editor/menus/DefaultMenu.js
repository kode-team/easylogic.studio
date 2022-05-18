export default [
  {
    type: "button",
    icon: "cube",
    action: (editor) => {
      editor.context.commands.emit("addCubeBox");
    },
  },
];
