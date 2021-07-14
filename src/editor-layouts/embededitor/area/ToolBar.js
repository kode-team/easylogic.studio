import "../../../el/editor/ui/menu-items/index";
import { EditorElement } from "el/editor/ui/common/EditorElement";
import ToolMenu from "./tool-bar/ToolMenu";
import { css } from "@emotion/css";
import PageSubEditor from "../../designeditor/area/PageSubEditor";

export default class ToolBar extends EditorElement {

    components() {
        return {
            PageSubEditor,
            ToolMenu
        }
    }


    afterRender() {
        setTimeout(() => {
          this.$el.$$(".elf--menu-item").forEach(it => {
            it.attr('data-direction', 'right');
          })
        }, 500);
    
      }

    template() {
        return /*html*/`
            <div class='${css(`
                display: block;
                position: absolute;
                left: 0px;
                top: 0px;
                right: 0px;
                bottom: 0px;

                .elf--menu-item {
                    height: 34px !important; 
                    width: 100% !important; 
                }

            `)}'>     
                <div class='center'>
                    <object refClass="ToolMenu" />
                    <object refClass='PageSubEditor' />  
                </div>
                <div class='right'>
                    <div class='tool-menu'>
                        <div class='items'>
                            <div class='draw-items'>
                                <object refClass="KeyBoard" />        
                                <object refClass="ExportView" />
                                <object refClass="Download" />
                                <object refClass="Save" />   
                                ${this.$menuManager.generate('toolbar.right')}                             
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `
    }
}