import { Layer } from "./Layer";
import { editor } from "../editor";

/**
 * Complex Component with children 
 */
export class Component extends Layer {
    
    is (...itemType) {
        if (itemType.includes('component')) {
            return true; 
        }

        return super.is(...itemType)
    }

    getProps () {
        
        return [
            // 'label',s
            // {key: 'color', defaultValue: Length.px(0), editor: 'ColorViewEditor', editorOptions: {} }
        ] 
    }
}

editor.registerComponent('component', Component);