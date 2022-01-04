import { iconUse } from "el/editor/icon/icon";
import { KeyStringMaker } from "el/editor/types/key";

export default [
    { icon: iconUse('outline_rect'), title: 'Rectangle', command: 'addLayerView', args: ['svg-rect'], shortcut: KeyStringMaker({ key: "Shift+R" }) },
    { icon: iconUse('outline_circle'), title: 'Circle', command: 'addLayerView', args: ['svg-circle'], shortcut:KeyStringMaker({ key: "Shift+O" }) },
    { icon: iconUse('polygon'), title: 'Polygon', command: 'addLayerView', args: ['polygon', {
      'background-color': 'transparent',
    }], shortcut: KeyStringMaker({ key: "Shift+P" }) },
    { icon: iconUse('star'), title: 'Star', command: 'addLayerView', args: ['star', {
      'background-color': 'transparent',
    }], shortcut: KeyStringMaker({ key: "Shift+S" }) },        
    '-',
    { icon: iconUse('smooth'), title: 'Spline', command: 'addLayerView', args: ['spline', {
      'background-color': 'transparent',
    }], shortcut: KeyStringMaker({ key: "Shift+L" }) },
    { icon: iconUse('text_rotate'), title: 'TextPath', command: 'addLayerView', args: ['svg-textpath', {
      'background-color': 'transparent',
    }], shortcut: KeyStringMaker({ key: "Shift+T" }) },
  ]