export default class Sort {

    static getContainer (editor) {
        return editor.selection.items.length === 1 ? editor.selection.currentArtboard : editor.selection.allRect;
    }

}