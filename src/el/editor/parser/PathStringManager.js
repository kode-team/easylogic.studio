import PathParser from "./PathParser";

export default class PathStringManager {
    constructor () {
        this.pathArray = [] 
    }

    reset () {
        this.pathArray = []
    } 

    getPointString (values) {
        return values.map(v => `${v.x} ${v.y}`).join(' ')
    }

    makeString (command, values = []) {
        this.pathArray.push(`${command} ${this.getPointString(values)}`)
        return this; 
    }

    M (...values) {
        return this.makeString('M', values);
    }

    L (...values) {
        return this.makeString('L', values);
    }    

    /**
     * x 표 그리기 
     * 
     * @param  {Point[]} values 
     */
    X (...values) {

        const dist = 3; 
        const point = values[0]

        const topLeft = {x: point.x - dist, y: point.y - dist}
        const topRight = {x: point.x + dist, y: point.y - dist}
        const bottomLeft = {x: point.x - dist, y: point.y + dist}
        const bottomRight = {x: point.x + dist, y: point.y + dist}

        return this.M(topLeft).L(bottomRight).M(topRight).L(bottomLeft);
    }        

    Q (...values) {
        return this.makeString('Q', values);
    }    

    C (...values) {
        return this.makeString('C', values);
    }    

    Z () {
        return this.makeString('Z');
    }        

    get d () {
        return this.pathArray.join(' ').trim();
    }

    toString (className = 'object') {
        return /*html*/`<path d="${this.d}" class='${className}'/>`
    }

    static makeRect (x, y, width, height) {
        var d = new PathStringManager()
            .M({x, y})
            .L({x: x + width, y})
            .L({x: x + width, y: y + height})
            .L({x, y: y + height})
            .L({x, y})
            .Z()
            .d

        return d; 
    }


    static makeLine (x, y, x2, y2) {
        var d = new PathStringManager()
            .M({x, y})
            .L({x: x2, y: y2})
            .d

        return d; 
    }    

    static makeCircle (x, y, width, height) {
        // refer to https://stackoverflow.com/questions/1734745/how-to-create-circle-with-b%C3%A9zier-curves

        var segmentSize = 0.552284749831;

        var d = new PathStringManager()
            .M({x: 0, y: -1})
            .C({x: segmentSize, y: -1},{x: 1, y: -segmentSize},{x: 1, y: 0})
            .C({x: 1, y: segmentSize},{x: segmentSize, y: 1},{x: 0, y: 1})
            .C({x: -segmentSize, y: 1},{x: -1, y: segmentSize},{x: -1, y: 0})
            .C({x: -1, y: -segmentSize},{x: -segmentSize, y: -1},{x: 0, y: -1})
            .Z()
            .d
        var parser = new PathParser(d);

        parser.translate(1, 1).scale(width/2, height/2).translate(x, y);

        return parser.toString();
    }

    static makePathByPoints (points = []) {
        var manager = new PathStringManager()

        for(var i = 0, len = points.length; i < len; i++) {
            const point = points[i];
            if (i === 0) {
                manager.M(point)
            } else {
                manager.L(point);
            }
        }

        return manager.d;
    }

}

