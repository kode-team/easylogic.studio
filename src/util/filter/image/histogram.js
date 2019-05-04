import { pixel } from '../functions'

export default function histogram (type = 'gray', points = []) {
    var $realPoints = [] 
    
    for(var i = 0; i < points.length - 1; i++) {
        var sp = points[i] 
        var ep = points[i+1] 

        var distX = ep[0] - sp[0]
        var distY = ep[1] - sp[1]

        var rate = distY / distX

        for(var realIndex = 0, start = sp[0]; realIndex < distX; realIndex++, start++ ) {
            $realPoints[start] = sp[1] + realIndex * rate
        }
    }

    $realPoints[255] = 255 

    if (type === 'red') {
        return pixel(() => {
            $r = $realPoints[$r];
        }, { }, { $realPoints })    
    } else if (type === 'green') {
        return pixel(() => {
            $g = $realPoints[$g];
        }, { }, { $realPoints }) 
    } else if (type === 'blue') {
        return pixel(() => {
            $b = $realPoints[$b];
        }, { }, { $realPoints })            
    } else {
        return pixel(() => {

            const l = Color.RGBtoYCrCb($r, $g, $b);
            const c = Color.YCrCbtoRGB(clamp($realPoints[clamp(l.y)]), l.cr, l.cb, 0)
            $r = c.r
            $g = c.g 
            $b = c.b 

        }, { }, { $realPoints })
    }
}
