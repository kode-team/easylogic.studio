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

export default [

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

    // clipboard 
    clipboardCopy,
    clipboardPaste
]