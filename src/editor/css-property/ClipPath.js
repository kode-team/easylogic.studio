import { Property } from "../items/Property";
import { Length } from "../unit/Length";
import { isUndefined } from "../../util/functions/func";
import { DirectionLength } from "../unit/DirectionLength";
const CLIPPATH_REG = /(content\-box|padding\-box|border\-box|margin\-box|view\-box|stroke\-box|fill\-box|none|(inset|circle|ellipse|polygon|path|url)(\(([^\)]*)\))?)/gi;
export class ClipPath extends Property {

    getDefaultObject(obj = {}) {
        return super.getDefaultObject( { 
            itemType: 'clip-path', 
            type: 'none',
            value: '',
            ...obj 
        })
    }

    toCloneObject() {
        return {
            ...super.toCloneObject(),
            value: this.json.value
        }
    }

    toString() {
        var type = this.json.type; 
        var value = this.json.value;
        var box = this.json.box; 

        var results = '';

        switch(type) {
            case 'circle':
            case 'inset':
            case 'ellipse':
            case 'polygon':
            case 'path':
                results = `${type}(${value})`;
                break;                
            case 'svg':
                results = `url(#${value})`;
                break;
            default: 
                results = 'none';
                break;
        }

        return box ? `${box} ${results}` : results;
    }    

    toCSS () {
        return {
            'clip-path': this.toString()
        }
    }


    static toCSS (obj) {
        return new ClipPath(obj).toCSS()
    }

    static toString (obj) {
        return ClipPath.toCSS(obj)['clip-path']
    }

    static parse (obj) {
        return new ClipPath(obj);
    }

    static parseStyle (str) { 

        var clippath = {};

        if (!str) return {};
    
        var matches = (str.match(CLIPPATH_REG) || []);

        matches.forEach((value, index) => {

            if (value.includes('-box')) {
                clippath.box = value; 
            } else {
                var [clipPathName, clipPathValue] = value.split("(");

                clipPathValue = clipPathValue || ''; 

                if (clipPathName === 'none') {
                    clipPathValue = ''
                } else {
                    clipPathValue = clipPathValue.split(")")[0];
                }
    
                clippath.type = clipPathName;
                clippath.value = clipPathValue;
            }
        });

        return clippath;
    }

    static parseStyleForCircle (str) {
        var radius = new Length('', 'closest-side'), position = ''; 
        str = str || '50%'
        if (str.includes('at')) {
            [ radius, position ] = str.split('at').map(it => it.trim());
        }  else {
            position = str.trim(); 
        }

        var [x, y] = position.split(' ')

        if (isUndefined(y)) {
            y = x; 
        }

        x = Length.parse(x)
        y = Length.parse(y)

        return {
            radius, x, y
        }
    }

    static parseStyleForEllipse (str = '50% 50%') {
        var radius = `50% 50%`, position = ''; 
        str = str || '50%'
        if (str.includes('at')) {
            [ radius, position ] = str.split('at').map(it => it.trim());
        }  else {
            position = str.trim(); 
        }

        var [x, y] = position.split(' ')

        if (isUndefined(y)) {
            y = x; 
        }

        x = Length.parse(x)
        y = Length.parse(y)

        var [radiusX, radiusY] = radius.split(' ');

        if (isUndefined(radiusY)) {
            radiusY = radiusX;
        }

        radiusX = Length.parse(radiusX)
        radiusY = Length.parse(radiusY)

        return {
            radiusX,
            radiusY, 
            x, 
            y
        }
    }

    static parseStyleForInset (str = '') {
        var [inset, round] = str.split('round')

        var [_count, top, right, bottom, left] = DirectionLength.parse(inset);

        if (round) {

            var [_roundCount, topRadius, rightRadius, bottomRadius, leftRadius] = DirectionLength.parse(round);

        }

        return {
            isAll: _count === 1,
            top, 
            right, 
            bottom, 
            left ,
            round,
            isAllRadius: _roundCount === 1,
            topRadius,
            rightRadius,
            bottomRadius,
            leftRadius
        }
    }

    
    static parseStyleForPolygon (str = '') {

        return str.split(',').filter(it => it.trim()).map(it => {
           var [x, y] = it.trim().split(' ')

           return { 
               x: Length.parse(x), 
               y: Length.parse(y)
            }
        })
    }
}
