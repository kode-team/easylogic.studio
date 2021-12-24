import { Editor } from "el/editor/manager/Editor";
// import AppearanceProperty from "./AppearanceProperty";
import ObjectProperty from 'el/editor/ui/property/ObjectProperty';

/**
 * 
 * @param {Editor} editor 
 */
export default function (editor) {
    editor.registerMenuItem('inspector.tab.style', {
        AppearanceProperty: ObjectProperty.create({
            title: editor.$i18n('background.color.property.title'),
            editableProperty: "appearance",
            inspector : (current) => {
                return [
                    {
                      key: 'background-color',
                      editor: 'color-view',
                      editorOptions: {
                        label: editor.$i18n('background.color.property.color'),
                      },
                      defaultValue: current['background-color']        
                    },
                    {
                      key: 'mix-blend-mode',
                      editor: 'blend-select',
                      editorOptions: {
                        label: editor.$i18n('background.color.property.blend'),
                      },
                      defaultValue: current['mix-blend-mode']
                    },
                    {
                      key: 'overflow',
                      editor: 'select',
                      editorOptions: {
                        label: editor.$i18n('background.color.property.overflow'),
                        options: [ 'visible', 'hidden', 'scroll', 'auto' ].map(it => {
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