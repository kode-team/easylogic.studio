import clipboardCopy from "./clipboard.copy";
import clipboardPaste from "./clipboard.paste";
import itemMoveShiftLeft from "./item.move.shift.left";
import itemMoveKeyLeft from "./item.move.key.left";
import itemMoveKeyRight from "./item.move.key.right";
import itemMoveKeyDown from "./item.move.key.down";
import itemMoveKeyUp from "./item.move.key.up";
import itemMoveShiftDown from "./item.move.shift.down";
import itemMoveShiftRight from "./item.move.shift.right";
import itemMoveShiftUp from "./item.move.shift.up";
import itemMoveAltLeft from "./item.move.alt.left";
import itemMoveAltDown from "./item.move.alt.down";
import itemMoveAltRight from "./item.move.alt.right";
import itemMoveAltUp from "./item.move.alt.up";
import itemDelete from "./item.delete";
import num1 from "./num.1";
import num2 from "./num.2";
import num3 from "./num.3";
import num4 from "./num.4";
import num5 from "./num.5";
import num6 from "./num.6";
import segmentMoveKeyDown from "./segment.move.key.down";
import segmentMoveKeyUp from "./segment.move.key.up";
import segmentMoveKeyRight from "./segment.move.key.right";
import segmentMoveKeyLeft from "./segment.move.key.left";
import segmentMoveShiftDown from "./segment.move.shift.down";
import segmentMoveShiftUp from "./segment.move.shift.up";
import segmentMoveShiftLeft from "./segment.move.shift.left";
import segmentMoveAltDown from "./segment.move.alt.down";
import segmentMoveAltUp from "./segment.move.alt.up";
import segmentMoveAltLeft from "./segment.move.alt.left";
import segmentMoveAltRight from "./segment.move.alt.right";
import segmentMoveShiftRight from "./segment.move.shift.right";
import segmentDelete from "./segment.delete";
import scaleMinus from "./scale.minus";
import scalePlus from "./scale.plus";

export default [

    // check number key 
    num1,
    num2,
    num3,
    num4,
    num5,
    num6,

    // move segment by arrow key 
    segmentMoveKeyDown,
    segmentMoveKeyUp,
    segmentMoveKeyRight,
    segmentMoveKeyLeft,

    segmentMoveShiftDown,
    segmentMoveShiftUp,
    segmentMoveShiftLeft,
    segmentMoveShiftRight,

    segmentMoveAltDown,
    segmentMoveAltUp,
    segmentMoveAltLeft,
    segmentMoveAltRight,

    segmentDelete,

    // move item by arrow key 
    itemMoveKeyLeft,
    itemMoveKeyRight,
    itemMoveKeyDown,
    itemMoveKeyUp,

    // move item by shift key
    itemMoveShiftDown,
    itemMoveShiftRight,
    itemMoveShiftUp,
    itemMoveShiftLeft,

    // move item by alt key
    itemMoveAltLeft,
    itemMoveAltDown,
    itemMoveAltRight,
    itemMoveAltUp,

    // 
    itemDelete,

    // zoom
    scaleMinus,
    scalePlus,    

    // clipboard 
    clipboardCopy,
    clipboardPaste
]