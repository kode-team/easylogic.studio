import { STRING_TO_CSS } from "elf/core/func";
import { BackgroundImage } from "elf/editor/property-parser/BackgroundImage";
import { URLImageResource } from "elf/editor/property-parser/image-resource/URLImageResource";

export default {
  command: "addBackgroundImageAsset",
  execute: function (editor, url, id = null) {
    var items = editor.context.selection.itemsByIds(id);
    let itemsMap = {};
    items.forEach((item) => {
      let images = BackgroundImage.parseStyle(
        STRING_TO_CSS(item.backgroundImage)
      );

      images.unshift(
        new BackgroundImage({
          image: new URLImageResource({ url }),
        })
      );

      itemsMap[item.id] = {
        "background-image": BackgroundImage.join(images),
      };
    });

    editor.context.commands.emit(
      "history.setAttribute",
      "add background image",
      itemsMap
    );
  },
};
