export function SimpleLayerInspector (item) {
  return [
    'Simple Value Editor Group',
    {
      key: `value`, 
      editor: 'SelectEditor', 
      editorOptions: {
        label: 'Option Value',
        options: item.options
      }, 
      refresh: true, 
      defaultValue: item['value'] 
    },
    {
      key: `value`, 
      editor: 'SimpleEditor', 
      editorOptions: {
        label: 'Simple Value',
      }, 
      refresh: true, 
      defaultValue: item['value'] 
    }
  ]
}
