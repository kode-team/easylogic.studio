export function ChartLayerInspector (item) {
    return [
      'Option: chart',
      {
        key: `chartOption.chart.title`, 
        editor: 'TextEditor', 
        editorOptions: {
          label: 'Title',
          options: 'tui-chart'
        }, 
        refresh: true, 
        convert: (currentItem, key, value) => {
          return {
            chartOption: {
              ...(currentItem.chartOption || {}),              
              chart: {
                ...(currentItem.chartOption?.chart || {}),
                title: value 
              }
            }
          }
        },
        defaultValue: item['chartOption']?.chart?.title 
      },   
      'Option: series',
      {
        key: 'chartOption.series',
        editor: 'ChartSeriesEditor',
        convert: (currentItem, key, value) => {

          return {
            chartOption: {
              ...(currentItem.chartOption || {}),
              series: {
                ...(currentItem.chartOption?.series || {}),
                ...value
              }
            }
          }
        },
        defaultValue: item['chartOption']?.series || {}
      },      
      'Option: legend', 
      {
        key: 'chartOption.legend',
        editor: 'LegendOptionsEditor',
        convert: (currentItem, key, value) => {
          return {
            chartOption: {
              ...(currentItem.chartOption || {}),
              legend: {
                ...(currentItem.chartOption?.legend || {}),
                ...value
              }
            }
          }
        },
        defaultValue: item?.chartOption?.legend || { 
          align: 'right',
          showCheckbox: true,
          visible: true
        }
      },              
      'Theme: chart',
      {
        key: 'chartOption.theme.chart',
        editor: 'ChartThemeEditor',
        convert: (currentItem, key, value) => {
          return {
            chartOption: {
              ...(currentItem.chartOption || {}),
              theme: {
                ...(currentItem.chartOption?.theme || {}),
                chart: {
                  ...(currentItem.chartOption?.theme?.chart || {}),
                  ...value
                }
              }
            }
          }
        },
        defaultValue: item?.chartOption?.theme?.chart || { 
          fontFamily: 'serif',
          backgroundColor: 'white'
        }
      },              

      'Theme: title',
      {
        key: 'chartOption.theme.title',
        editor: 'FontThemeEditor',
        convert: (currentItem, key, value) => {
          return {
            chartOption: {
              ...(currentItem.chartOption || {}),
              theme: {
                ...(currentItem.chartOption?.theme || {}),
                title: {
                  ...(currentItem.chartOption?.theme?.title || {}),
                  ...value
                }
              }
            }
          }
        },
        defaultValue: item?.chartOption?.theme?.title || { 
          fontSize: 13,
          fontFamily: 'serif',
          fontWeight: 400,
          color: 'black'
        }
      },                

      'Theme: legend',
      {
        key: 'chartOption.theme.legend.label',
        editor: 'FontThemeEditor',
        convert: (currentItem, key, value) => {
          return {
            chartOption: {
              ...(currentItem.chartOption || {}),
              theme: {
                ...(currentItem.chartOption?.theme || {}),
                legend: {
                  ...(currentItem.chartOption?.theme?.legend || {}),

                  label : {
                    ...(currentItem.chartOption?.theme?.legend?.label || {}),
                    ...value
                  }
                }
              }
            }
          }
        },
        defaultValue: item?.chartOption?.theme?.legend?.label || { 
          fontSize: 13,
          fontFamily: 'serif',
          fontWeight: 400,
          color: 'black'
        }
      },                    

      'Theme: X-Axis',
      {
        key: 'chartOption.theme.xAxis',
        editor: 'AxisThemeEditor',
        editorOptions: {
          key: 'theme.xAxis',
        },
        convert: (currentItem, key, value)=> {

          return {
            chartOption: {
              ...(currentItem.chartOption || {}),
              theme: {
                ...(currentItem.chartOption?.theme || {}),
                xAxis: {
                  ...(currentItem.chartOption?.theme?.xAxis || {}),
                  ...value
                }
              }
            }
          }
        },
        defaultValue: item?.chartOption?.theme?.xAxis || { 
          title: {
            fontSize: 13,
            fontFamily: 'serif',
            fontWeight: 400,
            color: 'black',
          },
          label: {
            fontSize: 13,
            fontFamily: 'serif',
            fontWeight: 400,
            color: 'black',
          },
          color: 'black',
        }
      },           
      'Theme: Y-Axis',
      {
        key: 'chartOption.theme.yAxis',
        editor: 'AxisThemeEditor',
        editorOptions: {
          key: 'theme.yAxis',
        },
        convert: (currentItem, key, value)=> {

          return {
            chartOption: {
              ...(currentItem.chartOption || {}),
              theme: {
                ...(currentItem.chartOption?.theme || {}),
                yAxis: {
                  ...(currentItem.chartOption?.theme?.yAxis || {}),
                  ...value
                }
              }
            }
          }
        },
        defaultValue: item?.chartOption?.theme?.yAxis || { 
          title: {
            fontSize: 13,
            fontFamily: 'serif',
            fontWeight: 400,
            color: 'black',
          },
          label: {
            fontSize: 13,
            fontFamily: 'serif',
            fontWeight: 400,
            color: 'black',
          },
          color: 'black',
        }        
      },                 
    ]
}