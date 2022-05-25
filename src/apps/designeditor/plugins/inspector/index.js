export default function (editor) {
  editor.context.config.set("inspector.selectedValue", "style");

  editor.registerUI("inspector.tab", {
    Style: {
      title: editor.$i18n("inspector.tab.title.design"),
      value: "style",
    },
    Transition: {
      title: editor.$i18n("inspector.tab.title.transition"),
      value: "transition",
    },
    Code: {
      title: editor.$i18n("inspector.tab.title.code"),
      value: "code",
    },
  });
}
