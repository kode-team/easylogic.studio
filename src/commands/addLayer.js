import _doForceRefreshSelection from "./_doForceRefreshSelection";

export default function addLayer (editor, layer, rect = {}, isSelected = true, containerItem) {

    if (!containerItem) {
        containerItem = editor.selection.current || editor.selection.currentArtboard
    }

    if (containerItem) {

        if (!containerItem.enableHasChildren()) {
            containerItem = containerItem.parent;
        }

        containerItem.appendChildItem(layer)

        if (isSelected) {
            editor.selection.select(layer);
        }

        _doForceRefreshSelection(editor,true, 10)
    } else {
        editor.emit('addArtBoard')

        editor.nextTick(() => {
            addLayer(editor, layer, rect);
        })
    }
}