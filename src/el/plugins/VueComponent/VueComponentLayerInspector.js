export function VueComponentLayerInspector (item) {
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