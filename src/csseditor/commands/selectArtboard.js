import _refreshSelection from "./_refreshSelection"

export default function selectArtboard (editor, artboard) {

    if (artboard) {
        editor.selection.selectArtboard(artboard)
        editor.selection.select(artboard)
        editor.emit('refreshArtboard');
        editor.emit('resetSelection');
    }
}
