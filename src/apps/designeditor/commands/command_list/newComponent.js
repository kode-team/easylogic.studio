import { PathParser } from "elf/core/parser/PathParser";

/**
 * 새로운 객체 생성
 *
 * 백그라운드를 적용해주거나 기본 속성을 적용
 *
 * @param {Editor} editor
 * @param {string} itemType
 * @param {KeyValue} obj
 * @param {boolean} isSelected
 * @param {Item} [containerItem=undefined]  상위 부모 객체
 */
export default function newComponent(
  editor,
  itemType,
  obj,
  isSelected = true,
  containerItem = undefined
) {
  if (itemType === "svg-textpath") {
    obj = {
      ...obj,
      fontSize: obj.height,
      textLength: "100%",
      d: PathParser.makeLine(0, obj.height, obj.width, obj.height).d,
    };
  } else if (itemType === "svg-circle") {
    itemType = "svg-path";
    obj = {
      ...obj,
      backgroundColor: undefined,
      fill: `#C4C4C4`,
      d: PathParser.makeCircle(0, 0, obj.width, obj.height).d,
    };
  } else if (itemType === "svg-rect") {
    itemType = "svg-path";
    obj = {
      ...obj,
      backgroundColor: undefined,
      fill: `#C4C4C4`,
      d: PathParser.makeRect(0, 0, obj.width, obj.height).d,
    };
  } else if (itemType === "text") {
    obj = {
      width: 300,
      height: 50,
      ...obj,
    };
  } else if (itemType === "artboard") {
    obj = {
      ...obj,
      backgroundColor: "white",
    };
  }

  const newObjAttrs = { itemType, ...obj };

  const item = editor.createModel(newObjAttrs);

  editor.context.commands.executeCommand(
    "moveLayerToTarget",
    `add layer - ${itemType}`,
    item,
    containerItem
  );

  editor.nextTick(() => {
    editor.emit("appendLayer", item);

    if (isSelected) {
      editor.context.selection.select(item);
    }
  });
}
