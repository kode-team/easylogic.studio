import { registElement } from "el/base/registerElement";
import { EditorElement } from "../common/EditorElement";

export default class VersionView extends EditorElement {

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