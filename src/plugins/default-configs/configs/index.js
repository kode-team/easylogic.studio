import bodyMoveMs from "./body.move.ms";
import canvasHeight from "./canvas.height";
import canvasWidth from "./canvas.width";
import debugMode from "./debug.mode";
import fixedAngle from "./fixed.angle";
import showRuler from "./show.ruler";
import setToolHand from "./set.tool.hand";
import showLeftPanel from "./show.left.panel";
import showRightPanel from "./show.right.panel";
import snapDistance from "./snap.distance";
import historyDelayMs from "./history.delay.ms";
import snapGrid from './snap.grid';
import storeKey from './store.key';
import areaWidth from './area.width';
import styleCanvasBackgroundColor from "./style.canvas.background.color";
import setMoveControlPoint from "./set.move.control.point";

export default [
    setMoveControlPoint,
    styleCanvasBackgroundColor,
    areaWidth,
    storeKey,
    setToolHand,
    canvasWidth,
    canvasHeight,
    bodyMoveMs,
    debugMode,
    fixedAngle,
    showRuler,
    showLeftPanel,
    showRightPanel,
    snapDistance,
    snapGrid,
    historyDelayMs
]