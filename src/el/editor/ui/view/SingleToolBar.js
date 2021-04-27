import { registElement } from "el/base/registElement";
import { EditorElement } from "../common/EditorElement";
import "../view-items/PageSubEditor";
import "./SingleToolMenu";
import "../menu-items/index";


export default class SingleToolBar extends EditorElement {
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

                            </div>
                        </div>
                    </div>                    
                </div>
                <div class='center'>
                    <div>
                        <object refClass="SingleToolMenu" />
                    </div>
                    <div>
                        <object refClass='PageSubEditor' />  
                    </div>
                </div>
                <div class='right'>
                    <div class='tool-menu'>
                        <div class='items'>
                            <div class='draw-items'>
                                <object refClass="Fullscreen" />                                  
                                <object refClass="KeyBoard" />        
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

registElement({ SingleToolBar })

