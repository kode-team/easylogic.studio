import PathParser from "el/editor/parser/PathParser";

export default function convertPath (editor, pathString, rect = null) {
    var current = editor.selection.current;

    // clip path 가 path 일 때 
    // path 속성을 가지고 있을 때 

    if (current )  {
        if (current.is('svg-path', 'svg-brush', 'svg-textpath')) {

            var d = pathString;

            if (rect) {
                var parser = new PathParser(pathString)
                parser.scale(current.width.value/rect.width, current.height.value/rect.height)

                d = parser.d; 
            }

            editor.command('setAttribute', 'set attribute -d', { d }, current)

        } else if (current['clip-path'].includes('path')) {
            var d = pathString;

            if (rect) {
                var parser = new PathParser(pathString)
                parser.scale(current.width.value/rect.width, current.height.value/rect.height)

                d = parser.d; 
            }

            // path string 을 저걸로 맞추기 
            editor.command('setAttribute', 'change clip path', { 'clip-path': `path(${d})` }, current)
        }
    }
}