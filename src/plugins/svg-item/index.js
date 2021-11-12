import { Editor } from "el/editor/manager/Editor";
import ColorMatrixEditor from "./editor/ColorMatrixEditor";
import FuncFilterEditor from "./editor/FuncFilterEditor";
import SVGFilterEditor from "./SVGFilterEditor";
import SVGFilterPopup from "./SVGFilterPopup";
import SVGFilterSelectEditor from "./SVGFilterSelectEditor";
import SVGItemProperty from "./SVGItemProperty";



/**
 * 
 * @param {Editor} editor 
 */
export default function (editor) {

    editor.registerElement({
        ColorMatrixEditor,
        FuncFilterEditor,
        SVGFilterSelectEditor,
        SVGFilterEditor
    })


    editor.registerMenuItem('inspector.tab.style', {
        SVGItemProperty
    })

    editor.registerMenuItem('popup', {
        SVGFilterPopup
    })

    editor.registerInspector('polygon', (item) => {
        return [
            {
                key: 'count',
                editor: 'NumberRangeEditor',
                editorOptions: {
                    label: 'Count',
                    min: 3,
                    max: 100,
                    step: 1
                }, 
                defaultValue: item.count
            },
            {
                key: 'button',
                editor: 'Button',
                editorOptions: {
                    label: 'Copy ',
                    text: 'as path',
                    action: "copy.path"
                }
            }
        ]
    })

    editor.registerInspector('star', (item) => {
        return [         
            {
                key: 'isCurve',
                editor: 'ToggleCheckBox',
                editorOptions: {
                    label: 'Curve',
                    // toggleLabels: ['Curve', 'Not Curve'],
                    defaultValue: item.isCurve,
                }
            },
            {
                key: 'count',
                editor: 'NumberRangeEditor',
                editorOptions: {
                    label: 'Count',
                    min: 1,
                    max: 100,
                    step: 1
                }
            },
            {
                key: 'radius',
                editor: 'NumberRangeEditor',
                editorOptions: {
                    label: 'Inner Radius',
                    min: -1,
                    max: 1,
                    step: 0.01
                }
            },
            {
                key: 'tension',
                editor: 'NumberRangeEditor',
                editorOptions: {
                    label: 'Tension',
                    min: 0,
                    max: 1,
                    step: 0.01
                }
            },
            {
                key: 'button',
                editor: 'Button',
                editorOptions: {
                    label: 'Copy ',
                    text: 'as path',
                    action: "copy.path"
                }
            }       

        ]
    })
}