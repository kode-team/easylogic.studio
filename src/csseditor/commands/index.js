import refreshElement from "./refreshElement";
import refreshProject from './refreshProject';
import setAttribute from "./setAttribute";
import resizeArtBoard from "./resizeArtBoard";
import convertPath from "./convertPath";
import addImage from "./addImage";
import addVideo from "./addVideo";
import addArtBoard from "./addArtBoard";
import addProject from "./addProject";
import addLayer from "./addLayer";
import selectArtboard from './selectArtboard';
import newComponent from "./newComponent";
import addComponentType from "./addComponentType";
import clipboardCopy from "./clipboard.copy";
import clipboardPaste from "./clipboard.paste";
import switchTheme from "./switchTheme";
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
import itemMoveLeft from "./item.move.left";
import itemMoveRight from "./item.move.right";
import itemMoveUp from "./item.move.up";
import itemMoveDown from "./item.move.down";
import itemDelete from "./item.delete";
import changeModeView from "./change.mode.view";
import segmentMoveDown from "./segment.move.down";
import segmentMoveUp from "./segment.move.up";
import segmentMoveRight from "./segment.move.right";
import segmentMoveLeft from "./segment.move.left";
import segmentDelete from "./segment.delete";
import toggleFullscreen from "./toggle.fullscreen";
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
import historySetAttribute from "./history.setAttribute";
import historyRedo from "./history.redo";
import historyUndo from "./history.undo";
import refreshSelection from "./refreshSelection";
import historyRefreshSelection from "./history.refreshSelection";
import setAttributeForMulti from "./setAttributeForMulti";
import historySetAttributeForMulti from "./history.setAttributeForMulti";



export default {
    // history + command  
    historySetAttribute,
    historySetAttributeForMulti,    
    historyRefreshSelection,
    historyRedo,
    historyUndo,

    // command 
    groupItem,
    ungroupItem,
    setEditorLayout,
    refreshSelection,
    refreshArtboard,
    resetSelection,
    addBackgroundColor,
    addBackgroundImagePattern,
    toggleFullscreen,
    segmentDelete,
    segmentMoveDown,
    segmentMoveUp,
    segmentMoveRight,
    segmentMoveLeft,
    changeModeView,
    itemDelete,
    itemMoveRight,
    itemMoveUp,
    itemMoveDown,
    itemMoveLeft,
    itemMoveDepthDown,
    itemMoveDepthUp,    
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
    switchTheme,
    clipboardPaste,
    clipboardCopy,
    addComponentType,
    addArtBoard,
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
    selectArtboard,
    setAttribute,  
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
}