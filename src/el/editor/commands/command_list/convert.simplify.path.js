
import { Length } from 'el/editor/unit/Length';
export default {
    command: 'convert.simplify.path',
    execute: (editor) => {
        const current = editor.selection.current;

        if (!current) return;

        editor.command("setAttributeForMulti", "change path string", editor.selection.packByValue(
          current.updatePath(editor.pathKitManager.simplify(current.d))
        ))
    }
}