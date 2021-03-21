import { registElement } from "@core/registerElement";
import UIElement from "@core/UIElement";

export default class VersionView extends UIElement {

    initState() {
        return {
            version: `@@VERSION@@`
        }
    }

    template () {
        return `<div class="version-view">v${this.state.version}</div>`
    }
}

registElement({ VersionView })