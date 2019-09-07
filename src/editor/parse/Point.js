export default class Point {
    static isEqual(a, b) {
        return a.x === b.x && a.y === b.y; 
    }

    static isFirst (point) {
        return point && point.command == 'M'
    }


    static getReversePoint(start, end) {
        var distX = (start.x -  end.x)
        var distY = (start.y -  end.y)
        // 여긴 시작 지점의 curve 
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


    // svg path 를 가지고 화면 에디터용 형태로 변환한다. 
    // 이렇게 변환하는 이유는 에디팅 하면서 생성하는 구조랑 SVG 를 로드하면서 생성하는 구조랑 맞추기 위해서이다. 
    // 공통된 구조를 가지고 편집하고 결과는 svg 로 변환한다. 

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

        if (currentPoint.connected) {
            return Point.getFirstPoint(points, index);
        }

        return points[index + 1]
    }       
}