export default [
  {
    type: "button",
    icon: (editor) => {
      if (editor.context.config.is("editor.theme", "dark")) {
        return "dark";
      } else {
        return "light";
      }
    },
    action: (editor) => {
      if (editor.context.config.get("editor.theme") === "dark") {
        editor.context.config.set("editor.theme", "light");
      } else {
        editor.context.config.set("editor.theme", "dark");
      }
    },
  },
];
