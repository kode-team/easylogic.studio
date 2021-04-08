import { registElement } from "el/base/registerElement";
import { EditorElement } from "../common/EditorElement";
import "../view-items/PageSubEditor";
import "./ToolMenu";
import "../menu-items/index";


export default class ToolBar extends EditorElement {
    template() {
        return /*html*/`
            <div class='tool-bar'>
                <div class='logo-item'>
                    <label class='logo'></label>
                </div>                 
                <div class='left'>
                    <div class='tool-menu'>
                        <div class='items'>
                            <div class='draw-items'>
                                <object refClass="Projects" />
                                <object refClass="Fullscreen" />      
                            </div>
                        </div>
                    </div>                    
                </div>
                <div class='center'>
                    <div>
                        <object refClass="ToolMenu" />
                    </div>
                    <div>
                        <object refClass='PageSubEditor' />  
                    </div>
                </div>
                <div class='right'>
                    <div class='tool-menu'>
                        <div class='items'>
                            <div class='draw-items'>
                                <object refClass="KeyBoard" />        
                                <object refClass="ExportView" />
                                <object refClass="Download" />
                                <object refClass="Save" />                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `
    }
}

registElement({ ToolBar })

