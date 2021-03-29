
export function BarChartLayerInspector (item) {
    return [
      {
        key: `chartTitle`, 
        editor: 'TextEditor', 
        editorOptions: {
          label: 'Title',
          options: 'tui-chart'
        }, 
        refresh: true, 
        defaultValue: item['chartTitle'] 
      },                  
      {
        key: `chartData`, 
        editor: 'SelectIconEditor', 
        editorOptions: {
          label: 'Chart Engine',
          options: 'tui-chart'
        }, 
        refresh: true, 
        defaultValue: item['chartData'] 
      },                        
    ]
}