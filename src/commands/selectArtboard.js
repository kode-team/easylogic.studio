import _doForceRefreshSelection from "./_doForceRefreshSelection"
import { isArray } from "@core/functions/func";

export default function selectArtboard (editor, artboard) {


    if (!artboard) {
        artboard = editor.selection.currentArtboard;
    } else if (isArray(artboard) && artboard.length === 0) {
        artboard = editor.selection.currentArtboard;
    }

    if (artboard) {
        editor.selection.selectArtboard(artboard)
        editor.selection.select(artboard)
        editor.emit('refreshArtboard');
        editor.emit('resetSelection');
    }
}
