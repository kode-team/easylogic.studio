
export default {
    command: 'convert.path.operation',
    description: 'apply path boolean operation',
    execute: (editor, booleanOperation) => {
        const current = editor.selection.current;

        if (!current) return;


        if (current.isBooleanPath || current.isBooleanItem) {

          let parent = current;

          if (current.isBooleanItem) {
            parent = current.parent;
          }

          // boolean operation 을 적용할 레이어를 먼저 선택한다. 
          editor.selection.select(parent);

          editor.command("setAttributeForMulti", "change boolean operation", editor.selection.packByValue({
            "boolean-operation": booleanOperation
          }))
        } else {
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
}