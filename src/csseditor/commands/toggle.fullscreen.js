import Dom from "../../util/Dom"

export default {
    command: 'toggle.fullscreen',
    execute: function (editor, items) {
        Dom.body().fullscreen();
    }
}