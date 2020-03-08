import { Layer } from "./Layer";
import { ComponentManager } from "../ComponentManager";

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
        return [] 
    }
}

ComponentManager.registerComponent('component', Component);