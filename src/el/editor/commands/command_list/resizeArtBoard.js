import _doForceRefreshSelection from "./_doForceRefreshSelection";
import { Length } from "el/editor/unit/Length";

export default function resizeArtBoard (editor, size = '') {
    var current = editor.selection.current;
    if (current && current.is('artboard')) {

        if (!size.trim()) return;

        var [width, height] = size.split('x')

        width = Length.px(+width);
        height = Length.px(+height);

        current.reset({ width, height });
        editor.selection.select(current);

        _doForceRefreshSelection(editor);
    }
}