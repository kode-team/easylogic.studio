import propertyEditor from "elf/ui/property-editor";

/**
 *
 * @param {Editor} editor
 */
export default function (editor) {
  editor.registerElement(propertyEditor);

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
