import { Editor } from "el/editor/manager/Editor";
import { Overflow } from "el/editor/types/model";
// import AppearanceProperty from "./AppearanceProperty";
import ObjectProperty from 'el/editor/ui/property/ObjectProperty';

/**
 * 
 * @param {Editor} editor 
 */
export default function (editor) {
    editor.registerUI('inspector.tab.style', {
        AppearanceProperty: ObjectProperty.create({
            title: editor.$i18n('background.color.property.title'),
            editableProperty: "appearance",
            preventUpdate: true,
            inspector : (current) => {
                return [
                    {
                      type: 'column', 
                      size: [1, 1],
                      columns: [
                        {
                          key: 'background-color',
                          editor: 'color-view',
                          editorOptions: {
                            compact: true,
                            format: true,
                          },
                          defaultValue: current['background-color']        
                        },
                        {
                          key: 'mix-blend-mode',
                          editor: 'blend-select',
                          editorOptions: {
                            label: 'tonality',
                            compact: true,
                          },
                          defaultValue: current['mix-blend-mode']
                        },
                      ]
                    },

                    {
                      key: 'overflow',
                      editor: 'select',
                      editorOptions: {
                        label: editor.$i18n('background.color.property.overflow'),
                        options: [ Overflow.VISIBLE, Overflow.HIDDEN, Overflow.SCROLL, Overflow.AUTO ].map(it => {
                            return {value: it, text: editor.$i18n(`background.color.property.overflow.${it}`) }
                        })
                      },
                      defaultValue: current['overflow']
                    }
                ]
            }
        })
    })
}