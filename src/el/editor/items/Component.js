import { Layer } from "./Layer";
import { ComponentManager } from "../manager/ComponentManager";
import icon from "../icon/icon";


/**
 * Complex Component with children 
 */
export class Component extends Layer {

    is(...itemType) {
        if (itemType.includes('component')) {
            return true;
        }

        return super.is(...itemType)
    }

    getProps() {
        return []
    }

    static createComponent({ iconString, title = 'Unknown Title', attrs = {}, enableHasChildren = false}) {
        return class extends Component {

            getIcon() {
                return icon.add || iconString;
            }

            getDefaultObject() {
                return super.getDefaultObject({
                    itemType: 'NewComponent',
                    name: "New Component",
                    ...attrs
                });
            }

            toCloneObject() {

                return {
                    ...super.toCloneObject(),
                    ...this.attrs(...Object.keys(attrs)),
                }
            }

            enableHasChildren() {
                return enableHasChildren || false;
            }

            getDefaultTitle() {
                return title;
            }

        }
    }
}

ComponentManager.registerComponent('component', Component);