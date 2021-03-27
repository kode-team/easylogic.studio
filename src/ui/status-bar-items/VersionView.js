import { registElement } from "@sapa/registerElement";
import UIElement from "@sapa/UIElement";

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