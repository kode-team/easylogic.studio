import { Length } from "../unit/Length";
import { EMPTY_STRING } from "../../util/css/types";
import { Property } from "../items/Property";

export class ClipPath extends Property {

    getDefaultObject(obj = {}) {
        return super.getDefaultObject( { itemType: 'clip-path', ...obj })
    }

    toCSS () {
        return {
            'clip-path': this.toString()
        }
    }

    isNone () { return true; }
    isEllipse () { return false; }
    isCircle () { return false; }
    isInset () { return false; }
    isPolygon () { return false; }
    isSVG () { return false; }

    isSideType(sideType) {
        return this.json.sideType == sideType; 
    }
}

export class NoneClipPath extends ClipPath {
    getDefaultObject() {
        return super.getDefaultObject({
            type: 'none'
        })
    }
    toString () { return 'none' }
}

export class EllipseClipPath extends ClipPath {
    getDefaultObject() {
        return super.getDefaultObject({ 
            type: 'ellipse',
            centerX: Length.percent(50),
            centerY: Length.percent(50),
            radiusX: Length.percent(100),
            radiusY: Length.percent(100),
            sideType: 'none' 
        })
    }

    isEllipse () { return true; }

    toString () {
        var json = this.json; 
        var sideType = json.sideType

        if (sideType == 'none') {
            var layer = this.parent()             
            var dist = layer.dist();
            var width = +layer.width.toPx();        // px 가 되어야 함.  
            var height = +layer.height.toPx();      // px 가 되어야 함 
    
            var radiusSizeX = Math.abs(json.radiusX.toPx(width) - json.centerX.toPx(width));
            var radiusPercentX = Length.percent( Math.floor((radiusSizeX) / dist * 100) );  
    
            var radiusSizeY = Math.abs(json.radiusY.toPx(height) - json.centerY.toPx(height));
            var radiusPercentY = Length.percent( Math.floor((radiusSizeY) / dist * 100) );  
            
            var radiusString = `${radiusPercentX} ${radiusPercentY}`
        } else if (sideType == 'closest-side' || sideType == 'farthest-side') {
            var radiusString = sideType
        }        
    
        return `ellipse(${radiusString} at ${json.centerX} ${json.centerY})`;
    }
}



export class CircleClipPath extends ClipPath {
    getDefaultObject() {
        return super.getDefaultObject({ 
            type: 'circle',
            centerX: Length.percent(50),
            centerY: Length.percent(50),
            radiusX: Length.percent(100),
            radiusY: Length.percent(100),
            sideType: 'none' 
        })
    }

    isCircle() { return true; }

    toString () {
        var json = this.json; 
        var sideType = json.sideType

        if (sideType == 'none') {
            var layer = this.parent()             
            var dist = layer.dist();
            var width = +layer.width.toPx();        // px 가 되어야 함.  
            var height = +layer.height.toPx();      // px 가 되어야 함 
    
            var radiusSize = Math.sqrt(
                Math.pow( Math.abs(json.radiusX.toPx(width) - json.centerX.toPx(width)), 2)  
                + 
                Math.pow( Math.abs(json.radiusY.toPx(height) - json.centerY.toPx(height)), 2)
            );
            var radiusString = Length.percent( Math.floor((radiusSize) / dist * 100) ); 

        } else if (sideType == 'closest-side' || sideType == 'farthest-side') {
            var radiusString = sideType
        }        
    
        return `circle(${radiusString} at ${json.centerX} ${json.centerY})`;
    }
} 

export class InsetClipPath extends ClipPath {
    getDefaultObject() {
        return super.getDefaultObject({ 
            type: 'inset',
            top: Length.percent(0),
            left: Length.percent(0),
            right: Length.percent(0),
            bottom: Length.percent(0)
        })
    }

    isInset () { return true; }

    toString () {
        const {top, right, bottom, left} = this.json; 

        return `inset(${top} ${right} ${bottom} ${left})`;
    }
}

export class PolygonClipPath extends ClipPath {
    getDefaultObject() {
        return super.getDefaultObject({ 
            type: 'polygon',
            fillRule: EMPTY_STRING,
            points: []
        })
    }

    removePoint (index) {
        this.json.points.splice(index,1)
    }

    copyPoint (index) {
        var copyItem = this.json.points[index]
        var copy = {x: Length.parse(copyItem.x), y : Length.parse(copyItem.y) }
        this.json.points.splice(index, 0, copy);
    }

    updatePoint (index, key, value) {
        this.json.points[index][key] = value; 
    }

    isPolygon() { return true; }

    toString () {
        var json = this.json; 

        var fillRule = json.fillRule == EMPTY_STRING ? '' : json.fillRule + ','; 
        var polygonString = json.points.map(it => `${it.x} ${it.y}`).join(', ');

        return `polygon(${fillRule} ${polygonString})`;
    }
}

export class SVGClipPath extends ClipPath {
    getDefaultObject() {
        return super.getDefaultObject({ 
            type: 'svg',
            svg: EMPTY_STRING
        })
    }

    isSVG() { return true; } 

    toString () {
        return `url(#clippath-${this.id})`
    }
}

const ClipPathClassName = {
    'none': NoneClipPath,
    'circle': CircleClipPath,
    'ellipse': EllipseClipPath,
    'inset': InsetClipPath,
    'polygon': PolygonClipPath,
    'svg': SVGClipPath
}


ClipPath.parse = (obj) => {
    var ClipPathClass = ClipPathClassName[obj.type];

    return new ClipPathClass(obj);
}