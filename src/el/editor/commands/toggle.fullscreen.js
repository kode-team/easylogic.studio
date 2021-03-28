import Dom from "el/base/Dom"

export default {
    command: 'toggle.fullscreen',
    execute: function (editor, items) {
        Dom.body().fullscreen();
    }
}