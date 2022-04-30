import _doForceRefreshSelection from "./_doForceRefreshSelection";

export default {
  command: "load.json",

  /**
   *
   * @param {Editor} editor
   * @param {*} json
   */
  execute: function (editor, json, context = { origin: "*" }) {
    editor.context.modelManager.load(json, context);

    // editor.load(projects);
    _doForceRefreshSelection(editor);
  },
};
