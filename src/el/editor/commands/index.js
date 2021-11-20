import refreshElement from "./refreshElement";
import refreshProject from './refreshProject';
import resizeArtBoard from "./resizeArtBoard";
import convertPath from "./convertPath";
import addImage from "./addImage";
import addVideo from "./addVideo";
import addArtBoard from "./addArtBoard";
import addProject from "./addProject";
import addLayer from "./addLayer";
import newComponent from "./newComponent";
import clipboardCopy from "./clipboard.copy";
import clipboardPaste from "./clipboard.paste";
import showExportView from "./showExportView";
import updateScale from "./updateScale";
import fileDropItems from "./fileDropItems";
import updateResource from "./updateResource";
import updateImage from "./updateImage";
import updateVideo from "./updateVideo";
import addImageAssetItem from "./addImageAssetItem";
import addVideoAssetItem from "./addVideoAssetItem";
import dropImageUrl from "./dropImageUrl";
import addSVGFilterAssetItem from "./addSVGFilterAssetItem";
import updateImageAssetItem from "./updateImageAssetItem";
import updateVideoAssetItem from "./updateVideoAssetItem";
import updateUriList from "./updateUriList";
import downloadJSON from "./downloadJSON";
import downloadSVG from "./downloadSVG";
import downloadPNG from "./downloadPNG";
import saveJSON from "./saveJSON";
import loadJSON from "./load.json";
import setLocale from "./setLocale";
import addTimelineProperty from "./addTimelineProperty";
import refreshSelectedOffset from "./refreshSelectedOffset";
import setTimelineOffset from "./setTimelineOffset";
import addTimelineCurrentProperty from "./addTimelineCurrentProperty";
import removeTimelineProperty from "./removeTimelineProperty";
import deleteTimelineKeyframe from "./deleteTimelineKeyframe";
import selectTimelineItem from "./selectTimelineItem";
import removeTimeline from "./removeTimeline";
import removeAnimationItem from "./removeAnimationItem";
import addTimelineKeyframe from "./addTimelineKeyframe";
import copyTimelineProperty from "./copyTimelineProperty";
import playTimelineItem from "./playTimelineItem";
import prevTimelineItem from "./prevTimelineItem";
import firstTimelineItem from "./firstTimelineItem";
import nextTimelineItem from "./nextTimelineItem";
import lastTimelineItem from "./lastTimelineItem";
import pauseTimelineItem from "./pauseTimelineItem";
import addTimelineItem from "./addTimelineItem";
import dropAsset from "./drop.asset";
import addBackgroundImageGradient from "./addBackgroundImageGradient";
import addBackgroundImageAsset from "./addBackgroundImageAsset";
import keymapKeydown from "./keymap.keydown";
import keymapKeyup from "./keymap.keyup";
import removeLayer from "./removeLayer";
import pushModeView from "./push.mode.view";
import segmentMoveDown from "./segment.move.down";
import segmentMoveUp from "./segment.move.up";
import segmentMoveRight from "./segment.move.right";
import segmentMoveLeft from "./segment.move.left";
import segmentDelete from "./segment.delete";
import addBackgroundImagePattern from "./addBackgroundImagePattern";
import addBackgroundColor from "./addBackgroundColor";
import scaleMinus from "./scale.minus";
import scalePlus from "./scale.plus";
import resetSelection from "./resetSelection";
import sortCenter from "./sort.center";
import sortLeft from "./sort.left";
import sortMiddle from "./sort.middle";
import sortBottom from "./sort.bottom";
import sortTop from "./sort.top";
import sortRight from "./sort.right";
import sameWidth from "./same.width";
import sameHeight from "./same.height";
import refreshArtboard from "./refreshArtboard";
import addLayerView from "./addLayerView";
import setEditorLayout from "./setEditorLayout";
import itemMoveDepthDown from "./item.move.depth.down";
import itemMoveDepthUp from "./item.move.depth.up";
import groupItem from "./group.item";
import ungroupItem from "./ungroup.item";
import historyRedo from "./history.redo";
import historyUndo from "./history.undo";
import historyRefreshSelection from "./history.refreshSelection";
import setAttributeForMulti from "./setAttributeForMulti";
import historySetAttributeForMulti from "./history.setAttributeForMulti";
import historyAddLayer from "./history.addLayer";
import historyRemoveLayer from "./history.removeLayer";
import updatePathItem from "./updatePathItem";
import updateClipPath from "./updateClipPath";
import moveLayer from "./moveLayer";
import moveToCenter from './moveToCenter';
import moveLayerForItems from "./moveLayerForItems";
import moveSelectionToCenter from "./moveSelectionToCenter";
import savePNG from "./savePNG";
import refreshCursor from "./refreshCursor";
import recoverCursor from "./recoverCursor";
import convertPasteText from "./convertPasteText";
import addCustomComponent from "./addCustomComponent";
import toggleToolHand from "./toggle.tool.hand";
import rotateLayer from "./rotateLayer";
import refreshHistory from "./refreshHistory";
import openEditor from './open.editor';
import doubleclickItem from "./doubleclick.item";
import update from "./model/update";
import historyRemoveProject from "./history.removeProject";
import historyRefreshSelectionProject from "./history.refreshSelectionProject";
import popModeView from "./pop.mode.view";
import copyPath from "./copy.path";
import itemMoveDepthFirst from "./item.move.depth.first";
import itemMoveDepthLast from "./item.move.depth.last";
import convertStrokeToPath from "./convert.stroke.to.path";
import convertSimplifyPath from "./convert.simplify.path";
import convertNormalizePath from "./convert.normalize.path";
import convertSmoothPath from "./convert.smooth.path";
import convertPolygonalPath from "./convert.polygonal.path";
import convertFlattenPath from "./convert.flatten.path";
import convertPathOperation from "./convert.path.operation";


export default {
    // update model 
    copyPath,
    update,
    popModeView,

    doubleclickItem,
    openEditor,
    refreshHistory,
    convertPasteText,
    refreshCursor,
    recoverCursor,
    toggleToolHand,
    rotateLayer,

    // history + command   
    historyAddLayer,
    historyRemoveLayer,
    historyRemoveProject,
    historySetAttributeForMulti,    
    historyRefreshSelection,
    historyRefreshSelectionProject,
    historyRedo,
    historyUndo,

    moveLayer,
    moveLayerForItems,
    moveToCenter,
    moveSelectionToCenter,

    // command 
    convertPathOperation,
    convertFlattenPath,
    convertPolygonalPath,
    convertSmoothPath,
    convertNormalizePath,
    convertStrokeToPath,
    convertSimplifyPath,
    groupItem,
    ungroupItem,
    setEditorLayout,
    refreshArtboard,
    resetSelection,
    addBackgroundColor,
    addBackgroundImagePattern,
    segmentDelete,
    segmentMoveDown,
    segmentMoveUp,
    segmentMoveRight,
    segmentMoveLeft,
    pushModeView,
    removeLayer,
    itemMoveDepthDown,
    itemMoveDepthUp,    
    itemMoveDepthFirst,
    itemMoveDepthLast,
    keymapKeydown,
    keymapKeyup,
    scaleMinus,
    scalePlus, 
    dropAsset,
    addBackgroundImageAsset,
    addBackgroundImageGradient,
    addTimelineItem,
    pauseTimelineItem,
    lastTimelineItem,
    nextTimelineItem,
    firstTimelineItem,
    prevTimelineItem,
    playTimelineItem,
    copyTimelineProperty,
    addTimelineKeyframe,
    removeAnimationItem,
    removeTimeline,
    selectTimelineItem,
    deleteTimelineKeyframe,
    removeTimelineProperty,
    addTimelineCurrentProperty,
    setTimelineOffset,
    refreshSelectedOffset,
    addTimelineProperty,
    setLocale,
    loadJSON,
    saveJSON,
    savePNG,
    downloadPNG,
    downloadSVG,
    downloadJSON,
    updateUriList,
    updateImageAssetItem,
    updateVideoAssetItem,
    addSVGFilterAssetItem,
    dropImageUrl,
    addImageAssetItem,
    addVideoAssetItem,
    updateImage,
    updateVideo,
    updateResource,
    fileDropItems,
    updateScale,
    showExportView,
    // switchTheme,
    clipboardPaste,
    clipboardCopy,
    addArtBoard,
    addCustomComponent,
    addImage,
    addVideo,
    addLayer,    
    addLayerView,
    addProject,
    convertPath,    
    newComponent,
    refreshElement,
    refreshProject,
    resizeArtBoard,
    setAttributeForMulti,
    sortBottom,
    sortCenter,
    sortLeft,
    sortMiddle,
    sortBottom,
    sortTop,
    sortRight,
    sameWidth,
    sameHeight,      
    updatePathItem,
    updateClipPath
}