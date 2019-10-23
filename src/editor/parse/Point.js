export default class Point {
    static isEqual(a, b) {
        return a.x === b.x && a.y === b.y; 
    }

    static isFirst (point) {
        return point && point.command == 'M'
    }

    // check whether C is in A->C line 
    // 지점의 각도가 맞는지 계산해서 같은 각이면 같이 움직이는 걸로 처리 하자 .
    static isInLine (A, B, C) {
        if (A.x === C.x) return B.x === C.x;
        if (A.y === C.y) return B.y === C.y;
        return (A.x - C.x) * (A.y - C.y) === (C.x - B.x) * (C.y - B.y);
    }

    static isLine (point) {
        return Point.isInLine(point.endPoint, point.startPoint, point,reversePoint);
    }

    static getReversePoint(start, end) {
        var distX = (start.x -  end.x)
        var distY = (start.y -  end.y)

        return {
            x: start.x + distX,
            y: start.y + distY
        }
    }    

    static getIndexPoint (points, index) {
        return points[index]
    }

    static getPoint (points, p0) {
        return points.filter(p => Point.isEqual(p.startPoint, p0))[0]
    }

    static getIndex (points, p0) {
        var firstIndex = -1; 
        for(var i = 0, len = points.length; i < len; i++) {
            var p = points[i]

            if (Point.isEqual(p.startPoint, p0)) {
                firstIndex = i; 
                break; 
            }
        }
        return firstIndex;
    }

    static getPointIndex (points, p0) {
        var firstIndex = -1; 
        for(var i = 0, len = points.length; i < len; i++) {
            var p = points[i]

            if (Point.isEqual(p, p0)) {
                firstIndex = i; 
                break; 
            }
        }
        return firstIndex;
    }
    
    static getLastPoint (points, index) {

        if (!points.length) return null;

        var lastIndex = -1; 
        for(var i = index + 1, len = points.length; i < len; i++) {
            if (points[i].command === 'M') {
                lastIndex = i - 1;
                break; 
            }
        }

        if (lastIndex == -1) {
            lastIndex = points.length - 1; 
        }

        if (points[lastIndex] && points[lastIndex].command === 'Z') {
            lastIndex -= 1; 
        }

        var point = points[lastIndex]

        if (point) {
            point.index = lastIndex;
        }

        return point
    }

    static getFirstPoint (points, index) {
        var firstIndex = -1; 
        for (var i = index - 1; i > 0; i--) {
            if (points[i].command === 'M') {
                firstIndex = i; 
                break; 
            }
        }
        
        if (firstIndex === -1) {
            firstIndex = 0; 
        }

        var point = points[firstIndex]
        
        if (point) {
            point.index = firstIndex;
        }

        return point
    }

    static getPrevPoint (points, index) {
        var prevIndex = index - 1; 

        if (prevIndex < 0) {
            return Point.getLastPoint(points, index);
        }

        var point = points[prevIndex]

        if (point) {
            point.index = prevIndex
        }

        return point;
    }    


    static getNextPoint (points, index) {

        var currentPoint = points[index]
        var nextPoint = points[index + 1]

        if (nextPoint) {
            nextPoint.index = index + 1; 
        }

        if (currentPoint.connected) {
            nextPoint = Point.getFirstPoint(points, index);
        }

        return nextPoint;
    }       
}