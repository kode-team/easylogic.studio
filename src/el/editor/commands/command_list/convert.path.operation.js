
export default {
  command: 'convert.path.operation',
  description: 'apply path boolean operation',
  execute: (editor, booleanOperation) => {
    const current = editor.selection.current;

    if (!current) return;

    const changeBooleanOperation = (booleanOperation) => {

      editor.command("setAttributeForMulti", "change boolean operation", editor.selection.packByValue({
        "boolean-operation": booleanOperation
      }))

      recoverBooleanPath();
    }

    const recoverBooleanPath = () => {
      editor.nextTick(() => {
        // path operation 을 적용 후 container 의 크기를 재구성한다. 
        editor.emit('recoverBooleanPath')

        editor.nextTick(() => {
          editor.emit('refreshSelection');
          // editor.emit('refreshSelectionTool');
        })
      })
    }


    if (current.is('boolean-path') || current.isBooleanItem) {

      let parent = current;

      if (current.isBooleanItem) {
        parent = current.parent;
      }

      // boolean operation 을 적용할 레이어를 먼저 선택한다. 
      editor.selection.select(parent);

      changeBooleanOperation(booleanOperation);

    } else {
      if (editor.selection.current?.isNot('boolean-path')) {
        editor.emit('group.item', {
          itemType: 'boolean-path',
          title: 'Intersection'
        });
      }

      editor.nextTick(() => {
        if (editor.selection.current?.is('boolean-path')) {
          changeBooleanOperation(booleanOperation);
        }
      }, 10);
    }

  }
}