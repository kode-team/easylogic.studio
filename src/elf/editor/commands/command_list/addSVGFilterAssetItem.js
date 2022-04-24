import { uuidShort } from "elf/utils/math";

export default {
  command: "addSVGFilterAssetItem",
  execute: function (editor, callback) {
    var project = editor.selection.currentProject;

    if (project) {
      var id = uuidShort();
      var index = project.createSVGFilter({ id, filters: [] });

      callback && callback(index, id);
    }
  },
};
