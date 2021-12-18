
import PathParser from 'el/editor/parser/PathParser';
export default {
    command: 'convert.smooth.path',
    description: 'convert path to smooth',
    execute: (editor, divideCount = 5, tolerance = 0.1, tension = 0.5) => {

        const current = editor.selection.current;

        if (!current) return;

        const smoothedPath = PathParser
          .fromSVGString(current.d)
          .divideSegmentByCount(divideCount)
          .simplify(tolerance)
          .cardinalSplines(tension)
          .d

        editor.command("setAttributeForMulti", "smooth path string", editor.selection.packByValue(
          current.updatePath(smoothedPath)
        ))  
    }
}