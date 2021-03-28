import { clone } from "el/base/functions/func";

export default class Point {
    static isEqual(a, b, c) {
        if (arguments.length === 2) {
            return a.x === b.x && a.y === b.y; 
        } else if (arguments.length === 3) {
            return Point.isEqual(a, b) && Point.isEqual(b, c);
        }
    }

    static isFirst (point) {
        return point && point.command == 'M'
    }


    static DouglasPeuker(tolerance, points, start, last) {
        if (last <= start + 1) return ;
    
        let maxdist2 = 0;
        let breakIndex = start; 
        const tol2 = tolerance * tolerance; // 임계점 설정 
        const startPoint = points[start];
        const lastPoint = points[last];
    
        for(var i = start + 1; i < last; i++) {
            // 꼭지점 길이 찾기 
            const dist2 = Point.segmentDistance2(points[i].x, points[i].y, startPoint, lastPoint);
    
            if (dist2 <= maxdist2) continue;
    
            breakIndex = i; 
            maxdist2 = dist2;
        }
    
        // 임계치를 넘어가면 분기 해서 다시 맞추기 
        if (maxdist2 > tol2) {
            points[breakIndex].mark = true;         // mark된 것만 점으로 출력 
    
            Point.DouglasPeuker(tolerance, points, start, breakIndex);
            Point.DouglasPeuker(tolerance, points, breakIndex, last);
        }
    }    

    static simply (points, tolerance) {

        if (points.length <= 2) {
            return points;
        }

        points = clone(points);

        // 처음과 끝은 무조건 존재하는 걸로 
        points[0].mark = true; 
        points[points.length-1].mark = true; 

        // 간소화 포인트 계산 
        Point.DouglasPeuker(tolerance, points, 0, points.length-1);

        return points.filter(it => Boolean(it.mark))
    }

    static segmentDistance2(x, y, A, B) {
        let dx = B.x - A.x; 
        let dy = B.y - A.y;
    
        let lenAB = dx * dx + dy * dy;
    
        let du = x - A.x; 
        let dv = y - A.y;
        let dot = dx * du + dy * dv; 
    
        if (lenAB === 0) return du * du + dv * dv; 
    
        if (dot <= 0) return du * du + dv * dv; 
        else if (dot >= lenAB) {
            du = x - B.x;
            dv = y - B.y;
    
            return du * du + dv * dv;
        } else {
            const slash = du * dy - dv * dx; 
            return slash * slash/lenAB;
        }
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

    static getConnectedPoint (points, index) {
        
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

    static removePoint (points, pIndex, segment) {
        if (segment === 'startPoint') {
            return points.filter((_, index) => index !== pIndex)
        }
    }

    static splitPoints (points) {

        let splitedPointGroup = [] 
        let lastPoints = [] 

        points.forEach(p => {
            if (Point.isFirst(p)) {
                lastPoints = [p];
                splitedPointGroup.push(lastPoints)
            } else {
                lastPoints.push(p);
            }
        })

        return splitedPointGroup;
    }

    static recoverPoints (pointGroup) {
        const newPoints = [] 

        // group 을 루프를 돈다. 
        pointGroup.forEach(points => {

            // group 은 points 리스트이다. 
            points.forEach((p, index) => {
                // point 중 첫번째는 command 가 M 이다. 
                if (index === 0) {
                    p.command = 'M';
                    p.originalCommand = 'M';
                }
            })

            newPoints.push.apply(newPoints, points);
        })

        // 그런 다음 전체 인덱스를 재조정한다. 
        newPoints.forEach((p, index) => {
            p.index = index
        })

        return newPoints
    }
}