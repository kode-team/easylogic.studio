import { STRING_TO_CSS } from "elf/core/func";
import { BackgroundImage } from "elf/editor/property-parser/BackgroundImage";

export default {
  command: "addBackgroundImageGradient",
  execute: function (editor, gradient, id = null) {
    var items = editor.context.selection.itemsByIds(id);

    let itemsMap = {};
    items.forEach((item) => {
      let images = BackgroundImage.parseStyle(
        STRING_TO_CSS(item.backgroundImage)
      );

      images.unshift(
        new BackgroundImage({
          image: BackgroundImage.parseImage(gradient),
        })
      );

      itemsMap[item.id] = {
        backgroundImage: BackgroundImage.join(images),
      };
    });

    editor.context.commands.emit(
      "history.setAttribute",
      "add gradient",
      itemsMap
    );
  },
};
