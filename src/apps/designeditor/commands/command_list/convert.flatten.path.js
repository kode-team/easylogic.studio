import { PathParser } from "elf/editor/parser/PathParser";
export default {
  command: "convert.flatten.path",
  description: "flatten selected multi path",
  execute: (editor) => {
    const current = editor.context.selection.current;

    if (!current) return;

    let newPath;

    if (current.is("boolean-path") || current.isBooleanItem) {
      let parent = current;
      if (current.isBooleanItem) {
        parent = current.parent;
      }

      newPath = parent.absolutePath(parent["boolean-path"]);
      newPath = parent.invertPath(newPath.d);

      const newLayerAttrs = parent.layers[0].toCloneObject();
      delete newLayerAttrs.id;
      delete newLayerAttrs.parentId;
      delete newLayerAttrs.transform;
      delete newLayerAttrs["boolean-path"];
      delete newLayerAttrs["boolean-operation"];

      const parentParent = parent.parent;
      const newRectInfo = parent.updatePath(newPath.d);

      editor.context.commands.executeCommand(
        "removeLayer",
        "remove selected layers",
        [parent.id]
      );
      editor.nextTick(() => {
        editor.context.commands.executeCommand(
          "addLayer",
          `add layer - path`,
          editor.createModel({
            ...newLayerAttrs,
            ...newRectInfo,
          }),
          true,
          parentParent
        );
      });
    } else {
      newPath = PathParser.fromSVGString();
      editor.context.selection.each((item) => {
        newPath.addPath(item.absolutePath());
      });

      newPath = current.invertPath(newPath.d);
      const parent = current.parent;
      const newPathInfo = current.updatePath(newPath.d);

      const newLayerAttrs = current.toCloneObject();
      delete newLayerAttrs.id;

      editor.context.commands.executeCommand(
        "removeLayer",
        "remove selected layers"
      );
      editor.nextTick(() => {
        editor.context.commands.executeCommand(
          "addLayer",
          `add layer - path`,
          editor.createModel({
            ...newLayerAttrs,
            ...newPathInfo,
          }),
          true,
          parent
        );
      });
    }
  },
};
