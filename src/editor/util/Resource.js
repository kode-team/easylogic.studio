function makeFilePromise (it) {
    return new Promise((resolve, reject) => {
        resolve({
            kind: it.kind, 
            type: it.type, 
            data: it.getAsFile()
        })
    })
}

function makeStringPromise (it) {
    return new Promise((resolve, reject) => {

        it.getAsFile(content => {
        
            resolve({
                kind: it.kind, 
                type: it.type, 
                data: content  
            })
        })

    })
}
  
export default class Resource {
    static getAllDropItems (e) {
        var items = [...e.dataTransfer.types].map((type, index) => {

            if (type.includes('text')) {
                return {
                    kind: 'string', 
                    type,
                    data: e.dataTransfer.getData(type)
                }
            }
        }).filter(it => it);
    
        var files = [...e.dataTransfer.files]

        return  [...items, ...files]
    }
}