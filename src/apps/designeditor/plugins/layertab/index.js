import GradientAssetsProperty from "./object-list/asset/GradientAssetsProperty";
import ImageAssetsProperty from "./object-list/asset/ImageAssetsProperty";
import PatternAssetsProperty from "./object-list/asset/PatternAssetsProperty";
import VideoAssetsProperty from "./object-list/asset/VideoAssetsProperty";
import AssetItems from "./object-list/AssetItems";
import CustomAssets from "./object-list/CustomAssets";
import LibraryItems from "./object-list/LibraryItems";
import ObjectItems from "./object-list/ObjectItems";

import { iconUse } from "elf/editor/icon/icon";

export default function (editor) {
  editor.context.config.set("layertab.selectedValue", "layer");

  editor.registerUI("layertab.tab", {
    Layer: {
      title: editor.$i18n("app.tab.title.layers"),
      icon: iconUse("layers"),
      value: "layer",
    },
    Library: {
      title: editor.$i18n("app.tab.title.libraries"),
      icon: iconUse("auto_awesome"),
      value: "library",
    },
    Asset: {
      title: editor.$i18n("app.tab.title.assets"),
      icon: iconUse("apps"),
      value: "asset",
    },
    Component: {
      title: editor.$i18n("app.tab.title.components"),
      icon: iconUse("plugin"),
      value: "component",
    },
  });

  editor.registerUI("layertab.tab.layer", {
    ObjectItems,
  });

  editor.registerUI("layertab.tab.library", {
    LibraryItems,
  });

  editor.registerUI("layertab.tab.asset", {
    AssetItems,
  });

  editor.registerUI("layertab.tab.component", {
    CustomAssets,
  });

  editor.registerUI("asset", {
    GradientAssetsProperty,
    PatternAssetsProperty,
    ImageAssetsProperty,
    VideoAssetsProperty,
  });
}
