import { Editor } from "el/editor/manager/Editor";
import BlendSelectEditor from "./BlendSelectEditor";
import ClipPathEditor from "./ClipPathEditor";
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

/**
 * 
 * @param {Editor} editor 
 */
export default function (editor) {
    editor.registerElement({
        IconListViewEditor,
        TextAreaEditor,
        TextEditor,
        ColorSingleEditor,
        CubicBezierEditor,
        ClipPathEditor,
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
        FontSelectEditor
    })
}