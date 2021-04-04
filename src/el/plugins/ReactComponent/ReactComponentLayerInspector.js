export function ReactComponentLayerInspector (item) {
  return [
    {
      key: `value`, 
      editor: 'TextEditor', 
      editorOptions: {
        label: 'Value',
      }, 
      refresh: true, 
      defaultValue: item?.value 
    },   
  ]
}