
export default {
    command: 'convert.path.operation',
    description: 'apply path boolean operation',
    execute: (editor, booleanOperation) => {
        const current = editor.selection.current;

        if (!current) return;

        if (editor.selection.current?.isNot('rect')) {
          editor.emit('group.item', {
            title: 'Intersection'
          });
        }

        editor.nextTick(() => {

          if (editor.selection.current?.is('rect')) {
            editor.command("setAttributeForMulti", "change boolean operation", editor.selection.packByValue({
              "boolean-operation": booleanOperation
            }))
          }
        }, 10);
  
    }
}