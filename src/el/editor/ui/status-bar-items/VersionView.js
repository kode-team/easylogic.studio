import { registElement } from "el/base/registElement";
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