export default [

    {
        type: 'Flood',
        id: 'flood',
        bound: { x: 100, y: 200},
        color: 'black',
        opacity: 1,
        connected: [
            {id: 'composite1'}
        ]
    },


    { 
        type: 'SourceAlpha', 
        id: 'shadowSource', 
        bound: { x: 100, y : 100 }, 
        connected: [{
            id: 'composite1'
        }]
    },

    {
        type: 'Composite',
        id: 'composite1',
        bound: { x: 400, y: 150 },
        in: [ 'flood', 'shadowSource' ] ,
        operator: 'out',
        connected: [{
            id: 'offset'
        }]        
    },

    {
        type: 'Offset', 
        id: 'offset', 
        bound: { x: 200, y : 100 }, 
        dx: 4, 
        dy: 4, 
        in: ['composite1'],
        connected: [
            {id: 'blur'}
        ]
    },


    {
        type: 'GaussianBlur',
        id: 'blur',
        bound: { x: 300, y: 100 },
        stdDeviationX: 4,
        stdDeviationY: 4, 
        edge: 'none',
        in: ['offset'],
        connected: [{
            id: 'composite2'
        }]
    },



    { 
        type: 'SourceAlpha', 
        id: 'shadowSource2', 
        bound: { x: 400, y : 200 }, 
        connected: [{
            id: 'composite2'
        }]
    },


    {
        type: 'Composite',
        id: 'composite2',
        bound: { x: 400, y: 150 },
        in: [ 'blur', 'shadowSource2' ] ,
        operator: 'out',
        connected: [{
            id: 'merge'
        }]        
    },    



    { 
        type: 'SourceGraphic', 
        id: 'shadowSource3', 
        bound: { x: 400, y : 200 }, 
        connected: [{
            id: 'merge'
        }]
    },    

    {
        type: 'Merge',
        id: 'merge',
        bound: { x: 500, y: 150 },
        in: [ 'composite2', 'shadowSource3']
    }

]