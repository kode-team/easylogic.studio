
export const predefinedBezier = {
    'linear': true,
    'ease': true,
    'ease-in': true,
    'ease-out': true,
    'ease-in-out': true 
}

export const bezierObj = {
    "ease" : "cubic-bezier(0.25, 0.1, 0.25, 1)",
    "ease-in" : "cubic-bezier(0.42, 0, 1, 1)",
    "ease-out" : "cubic-bezier(0, 0, 0.58, 1)"
};

export const bezierList = [
    [ 0, 0, 1, 1, 'linear', true],
    [ 0.25, 0.1, 0.25, 1, 'ease', true],
    [ 0.42, 0, 1, 1, 'ease-in', true],
    [ 0, 0, 0.58, 1, 'ease-out', true],
    [  0.47, 0, 0.745, 0.715,  'ease-in-sine'],
    [  0.39, 0.575, 0.565, 1,  'ease-out-sine'],
    [  0.445, 0.05, 0.55, 0.95,  'ease-in-out-sine'],
    [  0.55, 0.085, 0.68, 0.53,  'ease-in-quad'],
    [  0.25, 0.46, 0.45, 0.94,  'ease-out-quad'],
    [  0.455, 0.03, 0.515, 0.955,  'ease-in-out-quad'],
    [ 0.55, 0.055, 0.675, 0.19, 'ease-in-cubic'],
    [ 0.215, 0.61, 0.355, 1, 'ease-out-cubic'],
    [ 0.645, 0.045, 0.355, 1, 'ease-in-out-cubic'],
    [ 0.895, 0.03, 0.685, 0.22, 'ease-in-quart'],
    [ 0.165, 0.84, 0.44, 1, 'ease-out-quart'],
    [ 0.77, 0, 0.175, 1, 'ease-in-out-quart'],
    [0.6, 0.04, 0.98, 0.335, 'ease-in-circ'],
    [0.075, 0.82, 0.165, 1, 'ease-out-circ'], 
    [0.785,0.135,0.15,0.86, 'ease-in-out-circ'],
    [0.95,0.05,0.795,0.035, 'ease-in-expo'],
    [0.19,1,0.22,1, 'ease-out-expo'],
    [1,0,0,1, 'ease-in-out-expo'],
    [0.755,0.05,0.855,0.06, 'ease-in-quint'],
    [0.23,1,0.32,1, 'ease-out-quint'],
    [0.86,0,0.07,1, 'ease-in-out-quint'],
    [0.6,-0.28,0.735,0.045, 'ease-in-back'],
    [0.175, 0.885,0.32,1.275, 'ease-out-back'],
    [0.68,-0.55,0.265,1.55, 'ease-in-out-back']

];


export const getPredefinedCubicBezier = (str) => {
    return [...parseCubicBezier(bezierObj[str] || str)]
}

export const formatCubicBezier = (arr) => {
    arr = arr.map(it => Math.floor(it * 100)/100 )

    for(var i = 0, len  = bezierList.length; i < len; i++) {
        var bezier = bezierList[i];

        if (bezier[0] == arr[0] && bezier[1] == arr[1] && bezier[2] == arr[2] && bezier[3] == arr[3] && bezier[5] /* is support css timing function name */) {
            return bezier[4]; // timing function name
        }
    }

    return `cubic-bezier( ${arr.filter((_, index) => index < 4).join(',')} )`;
}

export const parseCubicBezier = (str) => {
    if (typeof str == 'string') {

        if (predefinedBezier[str]) {
            return bezierList.filter(it => it[4] === str)[0]
        } else {
            var arr = str.replace("cubic-bezier", "").replace("(", "").replace(")", "").split(",");
            arr = arr.map(it => parseFloat(it.trim()))
            return arr;
        }
    }

    return str;
}

export const calc = {
    B1 : function (t) { return t*t*t },
    B2 : function (t) { return 3*t*t*(1-t) },
    B3 : function (t) { return 3*t*(1-t)*(1-t) },
    B4 : function (t) { return (1-t)*(1-t)*(1-t) }
}

export const createBezier = (C1, C2, C3, C4) => {
    return function (p) {
        const x = C1.x * calc.B1(p) + C2.x * calc.B2(p) + C3.x * calc.B3(p) + C4.x * calc.B4(p);
        const y = C1.y * calc.B1(p) + C2.y * calc.B2(p) + C3.y * calc.B3(p) + C4.y * calc.B4(p);

        return { x, y };
    }
}

export const createBezierForPattern = (str) => {
    var bezierList = parseCubicBezier(str);

    var C1 = { x : 0, y : 0 };
    var C2 = { x : bezierList[0], y : bezierList[1] };
    var C3 = { x : bezierList[2], y : bezierList[3] };
    var C4 = { x : 1, y : 1 };

    return createBezier(C1, C2, C3, C4);

}