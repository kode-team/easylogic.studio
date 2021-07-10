import { Editor } from "el/editor/manager/Editor";
import BlendSelectEditor from "./BlendSelectEditor";
import ColorAssetsEditor from "./ColorAssetsEditor";
import CSSPropertyEditor from "./CSSPropertyEditor";
import DirectionEditor from "./DirectionEditor";
import FilterEditor from "./FilterEditor";
import FontSelectEditor from "./FontSelectEditor";
import GradientEditor from "./GradientEditor";
import InputArrayEditor from "./InputArrayEditor";
import InputRangeEditor from "./InputRangeEditor";
import IterationCountEditor from "./IterationCountEditor";
import MediaProgressEditor from "./MediaProgressEditor";
import NumberInputEditor from "./NumberInputEditor";
import NumberRangeEditor from "./NumberRangeEditor";
import RangeEditor from "./RangeEditor";
import SelectEditor from "./SelectEditor";
import SelectIconEditor from "./SelectIconEditor";
import StrokeDashArrayEditor from "./StrokeDashArrayEditor";


/**
 * 
 * @param {Editor} editor 
 */
export default function (editor) {
    editor.registerElement({
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