
import { Editor } from "el/editor/manager/Editor";
import { REACT_COMPONENT_TYPE } from "./constants";

/**
 * 
 * initialize ReactComponent Plugin 
 * 
 * @param {Editor} editor 
 */
export default function (editor, { Component, LayerRender, MenuItem }) {

    // register item layer 
    editor.registerItem(REACT_COMPONENT_TYPE, Component.createComponent({
        title: '',
        iconString: '',
        enableHasChildren: false,
        attrs: {
            primary: true
        }
    }));

    // register inspector editor 
    editor.registerInspector(REACT_COMPONENT_TYPE, function (item) {
        return [
            {
                key: `value`,
                editor: 'TextEditor',
                editorOptions: {
                    label: 'Value',
                },
                refresh: true,
                defaultValue: item?.value
            },
        ]
    })

    // register html renderer 

    class MyRenderer extends LayerRender {
        async update(item, currentElement) {


            let $reactComponentArea = currentElement.$(".react-component-area");
            if ($reactComponentArea) {

            }

            super.update(item, currentElement);
        }

        /**
        * 
        * @param {Item} item 
        */
        render(item) {
            var { id } = item;

            return /*html*/`
                <div class='element-item ${REACT_COMPONENT_TYPE}' data-id="${id}">
                  ${this.toDefString(item)}
                  <div class='react-component-area' data-domdiff-pass="true" style="width:100%;height:100%;"></div>
                </div>`
        }
    }

    editor.registerRenderer('html', REACT_COMPONENT_TYPE, new MyRenderer())


    class AddReactComponent extends MenuItem {
        getIconString() {
            return 'add_box';
        }
        
        getTitle() {
            return this.props.title || "React Component";
        }
        
        isHideTitle() {
            return true;
        }
        
        clickButton(e) {
            this.emit('addLayerView', REACT_COMPONENT_TYPE);
        }
    }

    editor.registerMenuItem('sidebar', {
        AddReactComponent
    })
}
