// import { Editor } from "elf/editor/manager/Editor";
import BlendSelectEditor from "./BlendSelectEditor";
import ColorAssetsEditor from "./ColorAssetsEditor";
import ColorSingleEditor from "./ColorSingleEditor";
import ColorViewEditor from "./ColorViewEditor";
import CSSPropertyEditor from "./CSSPropertyEditor";
import CubicBezierEditor from "./CubicBezierEditor";
import DirectionEditor from "./DirectionEditor";
import FilterEditor from "./FilterEditor";
import FontSelectEditor from "./FontSelectEditor";
import GradientEditor from "./GradientEditor";
import IconListViewEditor from "./IconListViewEditor";
import InputArrayEditor from "./InputArrayEditor";
import InputRangeEditor from "./InputRangeEditor";
import IterationCountEditor from "./IterationCountEditor";
import MediaProgressEditor from "./MediaProgressEditor";
import NumberInputEditor from "./NumberInputEditor";
import NumberRangeEditor from "./NumberRangeEditor";
import PathDataEditor from "./PathDataEditor";
import PolygonDataEditor from "./PolygonDataEditor";
import RangeEditor from "./RangeEditor";
import SelectEditor from "./SelectEditor";
import SelectIconEditor from "./SelectIconEditor";
import StrokeDashArrayEditor from "./StrokeDashArrayEditor";
import TextAreaEditor from "./TextAreaEditor";
import TextEditor from "./TextEditor";
import VarEditor from "./VarEditor";
import PathEditor from "./path/PathEditor";
import BoxShadowEditor from "./BoxShadowEditor";
import TextShadowEditor from "./TextShadowEditor";
import ComponentEditor from "./ComponentEditor";

/**
 *
 * @param {Editor} editor
 */
export default function (editor) {
  editor.registerElement({
    ComponentEditor,
    TextShadowEditor,
    BoxShadowEditor,
    IconListViewEditor,
    TextAreaEditor,
    TextEditor,
    ColorSingleEditor,
    CubicBezierEditor,
    PathEditor,
    ColorViewEditor,
    VarEditor,
    PathDataEditor,
    PolygonDataEditor,
    InputArrayEditor,
    StrokeDashArrayEditor,
    NumberInputEditor,
    NumberRangeEditor,
    MediaProgressEditor,
    SelectIconEditor,
    CSSPropertyEditor,
    DirectionEditor,
    IterationCountEditor,
    GradientEditor,
    FilterEditor,
    SelectEditor,
    BlendSelectEditor,
    RangeEditor,
    InputRangeEditor,
    ColorAssetsEditor,
    FontSelectEditor,
  });

  editor.registerAlias({
    "icon-list-view": "IconListViewEditor",
    "box-shadow": "BoxShadowEditor",
    "text-shadow": "TextShadowEditor",
    component: "ComponentEditor",
    "text-area": "TextAreaEditor",
    text: "TextEditor",
    "color-single": "ColorSingleEditor",
    "cubic-bezier": "CubicBezierEditor",
    path: "PathEditor",
    "clip-path": "ClipPathEditor",
    "color-view": "ColorViewEditor",
    var: "VarEditor",
    "path-data": "PathDataEditor",
    "polygon-data": "PolygonDataEditor",
    "input-array": "InputArrayEditor",
    "stroke-dash-array": "StrokeDashArrayEditor",
    "number-input": "NumberInputEditor",
    "number-range": "NumberRangeEditor",
    "media-progress": "MediaProgressEditor",
    "select-icon": "SelectIconEditor",
    "css-property": "CSSPropertyEditor",
    direction: "DirectionEditor",
    "iteration-count": "IterationCountEditor",
    gradient: "GradientEditor",
    filter: "FilterEditor",
    select: "SelectEditor",
    "blend-select": "BlendSelectEditor",
    range: "RangeEditor",
    "input-range": "InputRangeEditor",
    "color-assets": "ColorAssetsEditor",
    "font-select": "FontSelectEditor",
  });
}
