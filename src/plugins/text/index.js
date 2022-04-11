import { Editor } from "el/editor/manager/Editor";
import { TextClip, TextDecoration, TextTransform } from "el/editor/types/model";
import {ObjectProperty} from "el/editor/ui/property/ObjectProperty";

/**
 * 
 * @param {Editor} editor 
 */
export default function (editor) {

    editor.registerUI('inspector.tab.style', {

        TextProperty: ObjectProperty.create({
            title: editor.$i18n('text.property.title'),
            editableProperty: 'text-style',
            preventUpdate: true,
        })
    })

    editor.registerInspector('text-style', current => {
        return [
            {
                type: 'column',
                size: [2, 1, 1],
                columns: [
                    {
                        key: 'text-align',
                        editor: 'SelectIconEditor',
                        editorOptions: {
                            compact: true,
                            options: ["left", "center", "right", "justify"],
                            icons: ["align_left", "align_center", "align_right", "align_justify"],
                        },
                        defaultValue: current['text-align'] || 'left',
                    },
                    '-',
                    {
                        key: 'text-transform',
                        editor: 'SelectIconEditor',
                        editorOptions: {
                            options: [
                                { value: TextTransform.CAPITALIZE, text: "Ag" },
                                { value: TextTransform.UPPERCASE, text: "AG" },
                                { value: TextTransform.LOWERCASE, text: "ag" },
                              ],
                            compact: true,
                            icons: ["horizontal_rule"],
                        }
                    }
                ]
            },
            {
                type: 'column',
                size: [3, 2, 1],
                gap: 20,
                columns: [

                    {
                        key: 'text-decoration',
                        editor: 'SelectIconEditor',
                        editorOptions: {
                            options: [
                                { value: TextDecoration.NONE, text: 'None' },
                                { value: TextDecoration.UNDERLINE, text: 'Underline' },
                                { value: TextDecoration.LINE_THROUGH, text: 'LineThrough' }
                              ]
                            ,
                            icons: ["horizontal_rule", "underline", "strikethrough"],
                            onchange: 'changeTextValue'
                        },
                        defaultValue: current['text-tranform']

                    },                 
                    {
                        key: 'font-style',
                        editor: 'SelectIconEditor',
                        editorOptions: {
                            compact: true,
                            options: ["normal","italic"],
                            icons: ['title','italic'],
                        },
                        defaultValue: current['font-style']
                    },

                    {
                        key: 'text-clip',
                        editor: 'ToggleButton',
                        editorOptions: {
                            checkedValue: TextClip.TEXT,
                            toggleLabels: ['vignette', 'vignette'],
                            toggleTitles: ['', 'Text Clip'],
                            toggleValues: [TextClip.NONE, TextClip.TEXT],
                        },
                        defaultValue: current['text-clip'] || TextClip.NONE
                    }
                ]
            },
        ]
    })
}
