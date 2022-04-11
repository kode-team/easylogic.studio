
import {PathParser} from 'el/editor/parser/PathParser';
export default {
    command: 'convert.normalize.path',
    description: 'convert segments to bezier curve',
    execute: (editor) => {
        const current = editor.selection.current;

        if (!current) return;

        editor.command("setAttributeForMulti", "normalize path string", editor.selection.packByValue(
          current.updatePath(PathParser.fromSVGString(current.d).normalize().d)
        ))  
    }
}