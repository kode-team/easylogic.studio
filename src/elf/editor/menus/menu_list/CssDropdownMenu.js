import { iconUse } from "elf/editor/icon/icon";
import { KeyStringMaker } from "elf/editor/types/key";

export default [
  {
    icon: iconUse("rect"),
    title: "Rect Layer",
    command: "addLayerView",
    args: ["rect"],
    shortcut: KeyStringMaker({ key: "R" }),
  },
  {
    icon: iconUse("lens"),
    title: "Circle Layer",
    command: "addLayerView",
    args: ["circle"],
    shortcut: KeyStringMaker({ key: "O" }),
  },
  {
    icon: iconUse("title"),
    title: "Text",
    command: "addLayerView",
    args: ["text"],
    shortcut: KeyStringMaker({ key: "T" }),
  },
  {
    icon: iconUse("image"),
    title: "Image",
    command: "addLayerView",
    args: ["image"],
    shortcut: KeyStringMaker({ key: "I" }),
  },
  "-",
  {
    icon: iconUse("video"),
    title: "Video",
    command: "addLayerView",
    args: ["video"],
    shortcut: KeyStringMaker({ key: "V" }),
  },
  {
    icon: iconUse("iframe"),
    title: "IFrame",
    command: "addLayerView",
    args: ["iframe"],
    shortcut: KeyStringMaker({ key: "F" }),
  },
  {
    icon: iconUse("rect"),
    title: "SampleLayer",
    command: "addLayerView",
    args: ["sample"],
    shortcut: KeyStringMaker({ key: "F" }),
  },
];
