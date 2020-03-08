import _refreshSelection from "./_refreshSelection";

export default function addLayer (editor, layer, rect = {}) {

    var containerItem = editor.selection.current || editor.selection.currentArtboard

    if (containerItem) {

        if (!containerItem.enableHasChildren()) {
            containerItem = containerItem.parent;
        }

        containerItem.add(layer)

        if (rect.x) { layer.setScreenX(rect.x.value); }
        if (rect.y) { layer.setScreenY(rect.y.value); }

        editor.selection.select(layer);

        _refreshSelection(editor)
    } else {
        editor.emit('addArtBoard')

        setTimeout(() => {
            addLayer(editor, layer, rect);
        }, 50)
    }
}