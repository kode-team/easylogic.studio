import Canvas from '../Canvas'
import Matrix from '../Matrix'
import ImageFilter from './index' 
import Color from '../Color'
import { round } from '../functions/math';
import { UNIT_PERCENT_STRING, UNIT_PX_STRING, UNIT_EM_STRING, WHITE_STRING, EMPTY_STRING } from '../css/types';
import { isFunction, isString, isNumber, isArray, keyMap, keyEach } from '../functions/func';

let makeId = 0 

const functions = {
    partial,
    multi,
    merge,
    weight,
    repeat,
    colorMatrix,
    each,
    eachXY,
    createRandomCount,
    createRandRange,
    createBitmap,
    createBlurMatrix,
    pack,
    packXY,
    pixel,
    getBitmap,
    putBitmap,
    radian,
    convolution,
    parseParamNumber,
    px2em,
    px2percent,
    em2percent,
    em2px,
    percent2em,
    percent2px,
    filter,
    clamp,
    fillColor,
    fillPixelColor,
    multi,
    merge,
    matches,
    parseFilter,
    partial
}

const LocalFilter = functions

export default functions

const ROUND_MAX = 1000; 

export function weight(arr, num = 1) {
    return arr.map(i => {
        return i * num;
    })
}

export function repeat (value, num) {
    let arr = new Array(num)
    for(let i = 0; i < num; i++) {
        arr[i] = value 
    }
    return arr; 
}

export function colorMatrix(pixels, i, matrix) {
    var r = pixels[i], g = pixels[i + 1], b = pixels[i + 2], a = pixels[i + 3];

    fillColor(
        pixels, 
        i, 
        matrix[0] * r + matrix[1] * g + matrix[2] * b + matrix[3] * a,
        matrix[4] * r + matrix[5] * g + matrix[6] * b + matrix[7] * a,
        matrix[8] * r + matrix[9] * g + matrix[10] * b + matrix[11] * a,
        matrix[12] * r + matrix[13] * g + matrix[14] * b + matrix[15] * a
    )
}

export function makeFilter(filter) {

    if (isFunction( filter )) {
        return filter;
    }

    if (isString( filter )) {
        filter = [filter];
    }

    const filterName = filter.shift();

    if (isFunction( filterName )) {
        return filterName;
    }

    const params = filter;

    const filterFunction = ImageFilter[filterName] || LocalFilter[filterName] ;

    if (!filterFunction) {
        throw new Error(`${filterName} is not filter. please check filter name.`)
    }
    return filterFunction.apply(filterFunction, params);
}

export function forLoop (max, index = 0, step = 1, callback, done, functionDumpCount = 10000, frameTimer = 'full', loopCount = 50) {
    let runIndex = index 
    let timer = (callback) => { 
        setTimeout(callback, 0) 
    }
    
    if (frameTimer == 'requestAnimationFrame')  {
        timer = requestAnimationFrame
        functionDumpCount = 1000
    }

    if (frameTimer == 'full') { /* only for loop  */
        timer = null
        functionDumpCount = max 
    }

    function makeFunction (count = 50) {
        const arr = [...Array(count)];
        
        const functionStrings = arr.map(countIndex => {
            return `cri = ri + i * s; if (cri >= mx) return {currentRunIndex: cri, i: null}; c(cri); i++;`
        }).join('\n')

        const smallLoopFunction = new Function ('ri', 'i', 's', 'mx', 'c', `
            let cri = ri;
            
            ${functionStrings}
            
            return {currentRunIndex: cri, i: i} 
        `)        

        return smallLoopFunction
    }

    function runCallback () {

        const smallLoopFunction = makeFunction(loopCount) // loop is call  20 callbacks at once 

        let currentRunIndex = runIndex 
        let ret = {}; 
        let i = 0 
        while(i < functionDumpCount) {
            ret = smallLoopFunction(runIndex, i, step, max, callback)

            if (ret.i == null) {
                currentRunIndex = ret.currentRunIndex
                break; 
            }

            i = ret.i
            currentRunIndex = ret.currentRunIndex
        }

        nextCallback(currentRunIndex)
    }

    function nextCallback (currentRunIndex) {
        if (currentRunIndex) {
            runIndex = currentRunIndex
        } else {
            runIndex += step 
        }

        if (runIndex >= max) {
            done()
            return;  
        }

        if (timer) timer(runCallback)
        else runCallback()
    }

    runCallback()
}

export function each(len, callback, done, opt = {}) {

    forLoop(len, 0, 4, function (i) {
        callback(i, i >> 2 /* xyIndex */);
    }, function () {
        done()
    }, opt.functionDumpCount, opt.frameTimer, opt.loopCount)
}

export function eachXY(len, width, callback, done, opt = {}) {

    forLoop(len, 0, 4, function (i) {
        var xyIndex = i >> 2 
        callback(i, xyIndex % width, Math.floor(xyIndex / width));
    }, function () {
        done()
    }, opt.functionDumpCount, opt.frameTimer, opt.loopCount)
}

export function createRandRange(min, max, count) {
    var result = [];

    for (var i = 1; i <= count; i++) {
        var num = Math.random() * (max - min) + min;
        var sign = (Math.floor(Math.random() * 10) % 2 == 0) ? -1 : 1;
        result.push(sign * num);
    }

    result.sort();

    const centerIndex = Math.floor(count >> 1);
    var a = result[centerIndex];
    result[centerIndex] = result[0];
    result[0] = a;

    return result;
}

export function createRandomCount() {
    return [3 * 3, 4 * 4, 5 * 5, 6 * 6, 7 * 7, 8 * 8, 9 * 9, 10 * 10].sort(function (a, b) {
        return 0.5 - Math.random();
    })[0];
}

export function createBitmap(length, width, height) {
    return { pixels: new Uint8ClampedArray(length), width, height }
}

export function putPixel(dstBitmap, srcBitmap, startX, startY) {
    
    var len = srcBitmap.pixels.length / 4; 
    var dstX = 0, dstY = 0, x = 0, y = 0, srcIndex =0, dstIndex = 0;
    for(var i = 0; i < len; i++) {
        x = i % srcBitmap.width, y =  Math.floor(i / srcBitmap.width);

        dstX = startX + x 
        dstY = startY + y 

        if (dstX > dstBitmap.width) continue; 
        if (dstY > dstBitmap.height) continue; 

        srcIndex = (y * srcBitmap.width + x) << 2
        dstIndex = (dstY * dstBitmap.width + dstX) << 2

        dstBitmap.pixels[dstIndex] = srcBitmap.pixels[srcIndex]
        dstBitmap.pixels[dstIndex+1] = srcBitmap.pixels[srcIndex+1]
        dstBitmap.pixels[dstIndex+2] = srcBitmap.pixels[srcIndex+2]
        dstBitmap.pixels[dstIndex+3] = srcBitmap.pixels[srcIndex+3]
    }

}

export function getPixel(srcBitmap, dstBitmap, startX, startY) {
    var len = dstBitmap.pixels.length >> 2; 
    var srcX = 0, srcY = 0, x = 0, y = 0, srcIndex =0, dstIndex = 0;
    for(var i = 0; i < len; i++) {
        var x = i % dstBitmap.width, y =  Math.floor(i / dstBitmap.width);

        srcX = startX + x 
        srcY = startY + y 

        if (srcX > srcBitmap.width) continue; 
        if (srcY > srcBitmap.height) continue; 

        srcIndex = (srcY * srcBitmap.width + srcX) << 2
        dstIndex = (y * dstBitmap.width + x) << 2
        
        dstBitmap.pixels[dstIndex] = srcBitmap.pixels[srcIndex]
        dstBitmap.pixels[dstIndex+1] = srcBitmap.pixels[srcIndex+1]
        dstBitmap.pixels[dstIndex+2] = srcBitmap.pixels[srcIndex+2]
        dstBitmap.pixels[dstIndex+3] = srcBitmap.pixels[srcIndex+3]
    }
}

export function cloneBitmap(bitmap, padding = 0) {


    const width = bitmap.width + padding 
    const height = bitmap.height + padding 
        
    const newBitmap = { pixels: new Uint8ClampedArray(width * height * 4), width, height }

    return newBitmap
}

export function getBitmap(bitmap, area) {
    return Canvas.getBitmap(bitmap, area);
}

export function putBitmap(bitmap, subBitmap, area) {
    return Canvas.putBitmap(bitmap, subBitmap, area);
}

export function parseParamNumber (param, callback) {
    if (isString( param )) {
        param = param.replace(/deg|px|\%|em/g, EMPTY_STRING)
    }
    if (isFunction( callback )) {
        return callback(+param);
    }
    return +param 
} 

export function unit2px(unitValue, maxValue) {

    var value = parseParamNumber(unitValue);

    if (unitValue.includes(UNIT_PERCENT_STRING)) {
        return percent2px(value, maxValue);
    } else if (unitValue.includes(UNIT_PX_STRING)) {
        return value;
    } else if (unitValue.includes(UNIT_EM_STRING)) {
        return em2px(value, maxValue);
    }
}

export function unit2percent(unitValue, maxValue) {

    var value = parseParamNumber(unitValue);

    if (unitValue.includes(UNIT_PERCENT_STRING)) {
        return value;
    } else if (unitValue.includes(UNIT_PX_STRING)) {
        return px2percent(value, maxValue);
    } else if (unitValue.includes(UNIT_EM_STRING)) {
        return em2percent(value, maxValue);
    }
}

export function unit2em(unitValue, maxValue) {

    var value = parseParamNumber(unitValue);

    if (unitValue.includes(UNIT_PERCENT_STRING)) {
        return percent2em(value, maxValue);
    } else if (unitValue.includes(UNIT_PX_STRING)) {
        return px2em(value, maxValue);
    } else if (unitValue.includes(UNIT_EM_STRING)) {
        return value;
    }
}

export function px2percent (px, maxValue) {
    return round((px / maxValue) * 100, ROUND_MAX); 
}

export function px2em (px, maxValue, fontSize = 16) {
    return round((px / fontSize), ROUND_MAX);
}

export function em2px (em, maxValue, fontSize = 16) {
    return round(em * fontSize, ROUND_MAX); 
}

export function em2percent (em, maxValue) {
    return px2percent(em2px(em), maxValue); 
}

export function percent2px (percent, maxValue) {
    return round(maxValue * (percent/ 100), ROUND_MAX);
}

export function percent2em (percent, maxValue) {
    return px2em(percent2px(percent, maxValue), maxValue);
}

const filter_regexp = /(([\w_\-]+)(\(([^\)]*)\))?)+/gi;
const filter_split = WHITE_STRING

export { filter_regexp, filter_split }

export function pack(callback) {
    return function (bitmap, done) {
        each(bitmap.pixels.length, (i, xyIndex) => {
            callback(bitmap.pixels, i, xyIndex, bitmap.pixels[i], bitmap.pixels[i+1], bitmap.pixels[i+2], bitmap.pixels[i+3])
        }, function () {
            done(bitmap);
        })
    }
}

export function makePrebuildUserFilterList (arr) {

    const codeString = arr.map(it => {
        return ` 
            ${it.userFunction.$preContext}

            ${it.userFunction.$preCallbackString}

            $r = clamp($r); $g = clamp($g); $b = clamp($b); $a = clamp($a);
        `
     }).join('\n\n')

     var rootContextObject = { clamp, Color }
     arr.forEach(it => {
        rootContextObject = { ...rootContextObject, ...it.userFunction.rootContextObject}
     })

     var rootContextDefine = `const ` + keyMap(rootContextObject, (key) => {
        return ` ${key} = $rc.${key} `
     }).join(',')
 

    let FunctionCode = ` 
    let $r = $p[$pi], $g = $p[$pi+1], $b = $p[$pi+2], $a = $p[$pi+3];
    
    ${rootContextDefine}

    ${codeString}
    
    $p[$pi] = $r; $p[$pi+1] = $g; $p[$pi+2] = $b; $p[$pi+3] = $a;
    `
    
    const userFunction = new Function('$p', '$pi', '$rc', FunctionCode)

    return function ($pixels, $pixelIndex) {
        userFunction($pixels, $pixelIndex, rootContextObject)
    }
}

export function makeUserFilterFunctionList (arr) {
    let rootContextObject = {}    
    const list = arr.map(it => {
        let newKeys = []

        keyEach(it.context, (key) => {
            newKeys[key] = `n$${makeId++}${key}$` 
        })

        keyEach(it.rootContext, (key, value) => {
            newKeys[key] = `r$${makeId++}${key}$` 

            rootContextObject[newKeys[key]] = value
        })

        let preContext = Object.keys(it.context).filter(key => {
            if (isNumber( it.context[key] ) || isString( it.context[key] )) {
                return false 
            } else if (isArray(it.context[key])) {
                if (isNumber( it.context[key][0] ) || isString( it.context[key][0]) ) {
                    return false 
                }
            }

            return true 
        }).map((key, i) => {
            return [newKeys[key], JSON.stringify(it.context[key])].join(' = ')
        })
    
        let preCallbackString = it.callback.toString().split("{");
        
        preCallbackString.shift()
        preCallbackString = preCallbackString.join("{")
        preCallbackString = preCallbackString.split("}")
        preCallbackString.pop()
        preCallbackString = preCallbackString.join("}")  

        keyEach(newKeys, (key, newKey) => {
            if (isNumber(it.context[key]) || isString( it.context[key] )) {
                preCallbackString = preCallbackString.replace(new RegExp("\\"+key, "g"), it.context[key])
            } else if (isArray(it.context[key])) {
                if (isNumber( it.context[key][0] ) || isString( it.context[key][0] )) {
                    it.context[key].forEach((item, index) => {
                        preCallbackString = preCallbackString.replace(new RegExp("\\"+key+'\\[' + index + '\\]', "g"), item)
                    })
                } else {
                    preCallbackString = preCallbackString.replace(new RegExp("\\"+key, "g"), newKey)
                }
            } else {
                preCallbackString = preCallbackString.replace(new RegExp("\\"+key, "g"), newKey)
            }
        })

        return { preCallbackString, preContext }
    })

    const preContext = list.map((it, i) => {
        return it.preContext.length ? `const ${it.preContext};` : "";
    }).join('\n\n')

    const preCallbackString = list.map(it => {
        return it.preCallbackString
    }).join('\n\n')


    let FunctionCode = ` 
    let $r = $pixels[$pixelIndex], $g = $pixels[$pixelIndex+1], $b = $pixels[$pixelIndex+2], $a = $pixels[$pixelIndex+3];

    ${preContext}

    ${preCallbackString}
    
    $pixels[$pixelIndex] = $r
    $pixels[$pixelIndex+1] = $g 
    $pixels[$pixelIndex+2] = $b   
    $pixels[$pixelIndex+3] = $a   
    `

    const userFunction = new Function('$pixels', '$pixelIndex', '$clamp', '$Color', FunctionCode)

    userFunction.$preCallbackString = preCallbackString
    userFunction.$preContext = preContext
    userFunction.rootContextObject = rootContextObject 

    return userFunction
}

export function makeUserFilterFunction (callback, context = {}, rootContext = {}) {
    return makeUserFilterFunctionList([{ callback, context, rootContext }])
}

export function pixel(callback, context = {}, rootContext = {}) {
    const userFunction = makeUserFilterFunction(callback, context, rootContext)    

    const returnCallback = function (bitmap, done) { }

    returnCallback.userFunction = userFunction

    return returnCallback
}

const ColorListIndex = [0, 1, 2, 3]

export function swapColor (pixels, startIndex, endIndex) {

    ColorListIndex.forEach(i => {
        var temp = pixels[startIndex + i]
        pixels[startIndex + i] = pixels[endIndex + i]
        pixels[endIndex + i] = temp
    })
}

export function packXY(callback) {
    return function (bitmap, done, opt = {}) {
        eachXY(bitmap.pixels.length, bitmap.width, (i, x, y) => {
            callback(bitmap.pixels, i, x, y)
        }, function () {
            done(bitmap);
        }, opt)

    }
}

export function radian (degree) {
    return Matrix.CONSTANT.radian(degree)
}


export function createBlurMatrix (amount = 3) {
    const count = Math.pow(amount, 2)
    const value = 1/count
    return repeat (value, count)
}

export function fillColor(pixels, i, r, g, b, a) {
    if (arguments.length == 3) {      
        var {r, g, b, a} = arguments[2]
    }

    if (isNumber( r )) {pixels[i] = r; }
    if (isNumber( g )) {pixels[i + 1] = g; }
    if (isNumber( b )) {pixels[i + 2] = b; }
    if (isNumber( a )) {pixels[i + 3] = a; }
}

export function fillPixelColor (targetPixels, targetIndex,  sourcePixels, sourceIndex) {
    fillColor(
        targetPixels, 
        targetIndex,
        sourcePixels[sourceIndex],
        sourcePixels[sourceIndex+1],
        sourcePixels[sourceIndex+2],
        sourcePixels[sourceIndex+3]
    )
}

export function subPixelWeight  (dstPixels, pixels, dstIndex, sx, sy, sw, sh, halfSide, side, weights) {
    var r = 0, g = 0, b = 0, a = 0, len = side ** 2 ;

    for (var i = 0; i < len; i++) {
        const cy = Math.floor(i / side)
        const cx = i % side 

        const scy = sy + cy - halfSide;
        const scx = sx + cx - halfSide;

        if (scy >= 0 && scy < sh && scx >= 0 && scx < sw) {
            var srcIndex = (scy * sw + scx) * 4; 
            var wt = weights[cy * side + cx];
            r += pixels[srcIndex] * wt;
            g += pixels[srcIndex + 1] * wt;
            b += pixels[srcIndex + 2] * wt;
            a += pixels[srcIndex + 3] * wt;   // weight 를 곱한 값을 계속 더한다. 
        }                
    }

    fillColor(dstPixels, dstIndex, r, g, b, a)
}

export function createWeightTable (weights, min = 0, max = 255) {
    var weightTable = [] 

    weightTable = weights.map((w, i) => {
        return []
    })

    weights.forEach( (w, i) => {

        if (w != 0) {
            let data = weightTable[i]

            for(var i = min; i <= max; i++) {
                data[i] = w * i; 
            }    
        }

    })

    return weightTable
}

export function createSubPixelWeightFunction(weights, weightTable, width, height, opaque) {

    const side = Math.round(Math.sqrt(weights.length));
    const halfSide = Math.floor(side / 2);
    const alphaFac = opaque ? 1 : 0;

    let FunctionCode = `let r = 0, g = 0, b = 0, a = 0, scy = 0, scx =0, si = 0; `
    let R = [] 
    let G = [] 
    let B = [] 
    let A = [] 
    weights.forEach((wt, index) => {
        const cy = Math.floor(index / side)
        const cx = index % side
        const distY = cy - halfSide
        const distX = cx - halfSide

        if (wt == 0) {
            return; 
        }

        R.push(`$t[${index}][$sp[(($sy + (${distY})) * ${width} + ($sx + (${distX}))) * 4]]`)
        G.push(`$t[${index}][$sp[(($sy + (${distY})) * ${width} + ($sx + (${distX}))) * 4 + 1]]`)
        B.push(`$t[${index}][$sp[(($sy + (${distY})) * ${width} + ($sx + (${distX}))) * 4 + 2]]`)
        A.push(`$t[${index}][$sp[(($sy + (${distY})) * ${width} + ($sx + (${distX}))) * 4 + 3]]`)

    })

    FunctionCode += `r = ${R.join(' + ')}; g = ${G.join(' + ')}; b = ${B.join(' + ')}; a = ${A.join(' + ')};`
    FunctionCode += `$dp[$di] = r; $dp[$di+1] = g;$dp[$di+2] = b;$dp[$di+3] = a + (${alphaFac})*(255-a); `

    // console.log(FunctionCode)

    const subPixelFunction = new Function ('$dp', '$sp', '$di', '$sx', '$sy', '$t', FunctionCode )


    return function ($dp, $sp, $di, $sx, $sy) {
        subPixelFunction ($dp, $sp, $di, $sx, $sy, weightTable)
    }
}

export function convolution(weights, opaque = true) {
    const weightTable = createWeightTable(weights)
    return function (bitmap, done, opt = {}) {
        const side = Math.round(Math.sqrt(weights.length));
        const padding = side * 2     
        
        // 원본 크기를 늘림 
        let sourceBitmap = cloneBitmap(bitmap, padding)

        // 원본 데이타 복사 
        putPixel (sourceBitmap, bitmap, side, side)

        // 최종 아웃풋 
        let newBitmap = createBitmap(sourceBitmap.pixels.length, sourceBitmap.width, sourceBitmap.height)

        // 마지막 원본 아웃풋 
        let returnBitmap = createBitmap(bitmap.pixels.length, bitmap.width, bitmap.height)

        const subPixelWeightFunction = createSubPixelWeightFunction(weights, weightTable, sourceBitmap.width, sourceBitmap.height, opaque)
        
        var len = bitmap.pixels.length /4 
        for (var i = 0; i < len; i++ ) {
            var xyIndex = i , x = xyIndex % bitmap.width + side, y = Math.floor(xyIndex / bitmap.width) + side ;

            subPixelWeightFunction(
                newBitmap.pixels, 
                sourceBitmap.pixels, 
                (y * sourceBitmap.width + x) * 4, 
                x, 
                y 
            );
        }

        getPixel(newBitmap, returnBitmap, side, side)
        done(returnBitmap)        
    }
}


export function matches (str) {
    var ret = Color.convertMatches(str)
    const matches = ret.str.match(filter_regexp);
    let result = [];

    if (!matches) {
        return result;
    }

    result = matches.map((it) => {
        return { filter: it, origin: Color.reverseMatches(it, ret.matches) }
    })

    var pos = { next: 0 }
    result = result.map(item => {

        const startIndex = str.indexOf(item.origin, pos.next);

        item.startIndex = startIndex;
        item.endIndex = startIndex + item.origin.length;

        item.arr = parseFilter(item.origin) 

        pos.next = item.endIndex;

        return item 
    }).filter(it => {
        if (!it.arr.length) return false 
        return true
    })

    return result;
}

/**
 * Filter Parser 
 * 
 * F.parseFilter('blur(30)') == ['blue', '30']
 * F.parseFilter('gradient(white, black, 3)') == ['gradient', 'white', 'black', '3']
 * 
 * @param {String} filterString 
 */
export function parseFilter (filterString) {

    var ret = Color.convertMatches(filterString)
    const matches = ret.str.match(filter_regexp);

    if (!matches[0]) {
        return []
    }

    var arr = matches[0].split('(')

    var filterName = arr.shift()
    var filterParams = [] 

    if (arr.length) {
        filterParams = arr.shift().split(')')[0].split(',').map(f => {
            return Color.reverseMatches(f, ret.matches)
        })    
    }
    
    var result = [filterName, ...filterParams].map(Color.trim)
    
    return result 
}

export function clamp (num) {
    return Math.min(255, num)
} 

export function filter (str) {
    return merge(matches(str).map(it => {
        return it.arr 
    }))
}

export function makeGroupedFilter(filters = []) {
    var groupedFilter = [] 
    var group = []
    for (var i = 0, len = filters.length; i < len; i++) {
        var f = filters[i]

        if (f.userFunction) {
            group.push(f)
        } else {
            if (group.length) {
                groupedFilter.push([...group])
            }
            groupedFilter.push(f)
            group = [] 
        }
    }

    if (group.length) {
        groupedFilter.push([...group])
    }

    groupedFilter.forEach((filter, index) => {
        if (Array.isArray(filter)) {
            groupedFilter[index] = (function () {
                const userFunction = makePrebuildUserFilterList(filter)
                // console.log(userFunction)
                return function (bitmap, done) {

                    for (var i = 0, len = bitmap.pixels.length; i< len;i += 4) {
                        userFunction(bitmap.pixels, i)
                    }

                    done(bitmap)
                    // forLoop(bitmap.pixels.length, 0, 4, function (i) {
                    //     userFunction(bitmap.pixels, i)
                    // }, function () {
                    //     done(bitmap)
                    // })
                }
            })()
        }
    })

    return groupedFilter
}

/** 
 * 
 * multiply filters
 * 
 * ImageFilter.multi('blur', 'grayscale', 'sharpen', ['blur', 3], function (bitmap) {  return bitmap });
 * 
 */
export function multi (...filters) {
    filters = filters.map(filter => {
        return makeFilter(filter);
    }).filter(f => f)

    filters = makeGroupedFilter(filters)

    var max = filters.length 

    return function (bitmap, done, opt = {}) {

        var currentBitmap = bitmap 
        var index = 0 

        function runFilter () {
            filters[index].call(null, currentBitmap, function (nextBitmap) {
                currentBitmap = nextBitmap  
    
                nextFilter()
            }, opt)
        }

        function nextFilter () {
            index++ 

            if (index >= max) {
                done(currentBitmap)
                return;  
            }

            runFilter()
        }

        runFilter()
    }
}


export function merge (filters) {
    return multi(...filters);
}

/**
 * apply filter into special area
 * 
 * F.partial({x,y,width,height}, filter, filter, filter )
 * F.partial({x,y,width,height}, 'filter' )
 * 
 * @param {{x, y, width, height}} area 
 * @param {*} filters   
 */
export function partial (area, ...filters) {
    var allFilter = null 
    if (filters.length == 1 && isString(filters[0])) {
        allFilter = filter(filters[0])
    } else {
        allFilter = merge(filters)
    } 

    return (bitmap, done, opt = {}) => {
        allFilter(getBitmap(bitmap, area), function (newBitmap) {
            done(putBitmap(bitmap, newBitmap, area))
        }, opt)
    }
}