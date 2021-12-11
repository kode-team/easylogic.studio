
import { Length } from 'el/editor/unit/Length';
export default {
    command: 'switch.path',
    execute: async (editor, text) => {
        const current = editor.selection.current;

        if (!current) return;

        if (current.isBooleanPath || current.isBooleanItem) {
          let parent = current;

          if (current.isBooleanItem) {
            parent = current.parent;
          }

          editor.selection.select(parent);

          editor.command("setAttributeForMulti", "change boolean operation", editor.selection.packByValue({
            // reverse children 
            'boolean-operation': parent['boolean-operation'],
            children: parent.children.reverse()
          }))

          editor.selection.select(current);
          editor.emit('refreshSelection');
          editor.emit('refreshSelectionTool');


        }
    }
}