import ObjectProperty from "el/editor/ui/property/ObjectProperty";
import Color from "el/utils/Color";
import { CSS_TO_STRING } from "el/utils/func";
import { SampleLayer } from "./SampleLayer";
import SampleRender from "./SampleRender";

/**
 * 
 * @param {Editor} editor 
 */
 export default function (editor) {

    editor.registerComponent('sample', SampleLayer);

    editor.registerRenderer('html', 'sample', new SampleRender());

    editor.registerMenuItem('inspector.tab.style', {
        SampleProperty: ObjectProperty.create({
          title: 'Sample 속성 편집기',
          editableProperty: 'sample',
          preventUpdate: true     // 마우스를 드래그 하는 동안은 업데이트 하지 않음. 
        })
    })    

    editor.registerInspector('sample', current => {
        return [
            'Sample Text 편집',
            {
                key: 'sampleText',
                editor: 'TextEditor',
                defaultValue: current.sampleText
            },
            'Sample Number 편집',
            {
                key: 'sampleNumber',
                editor: 'NumberInputEditor',
                editorOptions: {
                    min: 0,
                    max: 10,
                    step: 1,
                    label: 'SN',
                },
                defaultValue: current.sampleNumber
            },
            '스타일 카피',
            {
                type: 'column',
                size: [1, 1],
                gap: 10,
                columns: [
                    {
                        key: 'copyCssJSON',
                        editor: 'Button',
                        editorOptions: {
                          text: 'Copy CSS JSON',
                          onClick: () => {

                              console.log(JSON.stringify(editor.html.toCSS(current), null, 4));
                          }
                        },
                    },
                    {
                        key: 'copyCssString',
                        editor: 'Button',
                        editorOptions: {
                          text: 'Copy CSS String',
                          onClick: () => {
                              console.log(CSS_TO_STRING(editor.html.toCSS(current)));
                          }
                        },
                    },
                    {
                        key: 'changeColor',
                        editor: 'Button',
                        editorOptions: {
                          text: 'Change Text Random Color',
                          onClick: () => {

                            // 색깔 구하기 , 랜덤하게  
                            const textColor = Color.random();
                            const backgroundColor = Color.random();

                            // current 에 색깔 적용
                            editor.emit('setAttributeForMulti', {
                                [current.id]: {
                                    color: textColor,
                                    'background-color': backgroundColor
                                }
                            })
                            
                          }
                        },
                    },                    
                ]
            }
        ]  
    })
}