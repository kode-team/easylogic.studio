export default class AssetParser {
    static parse(datauri) {
        var [_, data] = datauri.split('data:')
        var [mediaType, ...content] = data.split(',')
        var [mimeType, encoding] = mediaType.split(';')

        content = content.join(',');

        var objectInfo = AssetParser.parseInfo(mimeType, encoding, content);

        return { mediaType, content, mimeType, encoding, objectInfo }
    }

    static parseInfo (mimeType, encoding, content) {

        if (encoding === 'json') {
            return JSON.parse(content);
        }

        return {}
    }



    static filter (datauri, mediaType) {
        return datauri.includes(`data:${mediaType}`)
    }    

    static changeColor (datauri, obj = {} ) {
        var info = AssetParser.parse(datauri);

        var newObjectInfo = {...info.objectInfo, ...obj}

        return AssetParser.generateColor(info, newObjectInfo);
    }

    static changeGradient (datauri, obj = {} ) {
        var info = AssetParser.parse(datauri);

        var newObjectInfo = {...info.objectInfo, ...obj}

        return AssetParser.generateGradient(info, newObjectInfo);
    }   
    
    static changeSVGFilter (datauri, obj = {} ) {
        var info = AssetParser.parse(datauri);

        var newObjectInfo = {...info.objectInfo, ...obj}

        return AssetParser.generateSVGFilter(info, newObjectInfo);
    }       

    static generateJSON(type, info) {
        return `data:${type};json,${JSON.stringify(info)}`
    }

    static generateColor (info, newObjectInfo) {
        return AssetParser.generateJSON('color', newObjectInfo);
    }

    static generateGradient (info, newObjectInfo) {
        return AssetParser.generateJSON('gradient', newObjectInfo);
    }   
    
    static generateSVGFilter (info, newObjectInfo) {
        return AssetParser.generateJSON('svgfilter', newObjectInfo);
    }       
}