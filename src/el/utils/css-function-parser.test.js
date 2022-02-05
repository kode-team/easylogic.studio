
import { expect, test } from 'vitest';
import { parseOneValue, parseValue } from './css-function-parser';

test("create css linear-gradient timing test - ease", () => {
    const result = parseOneValue("linear-gradient(-0.7791965086794089% 40.30037452797422% 80.05772932007076% 40.021450975161% pad, #45abd6 0% ,rgb(14,71,119) 48.98766411675347% steps(3, start),rgb(137,111,133) 72.67366131157286% steps(10, start),#f69292 99.06577580909027% ease 15)");
})

test("create css 8 digit color", () => {
    const result = parseValue("#ffffff34");   
    
    expect(result).toEqual([
        {
          matchedString: '#ffffff34',
          startIndex: 0,
          endIndex: 9,
          func: 'hex',
          parsed: {
            funcType: 'color',
            type: 'hex',
            r: 255,
            g: 255,
            b: 255,
            a: 0.20392156862745098,
            h: 0,
            s: 0,
            l: 100
          }
        }
      ])
})

test("create css color parser", () => {
    const result = parseValue('#FFFFFF white rgba(255, 255, 0.1, 0.5), hsl(360, 0.1, 0.1)')

    // console.log(JSON.stringify(result, null, 2));

    expect(result).toEqual([
        {
            "matchedString": "#FFFFFF",
            "startIndex": 0,
            "endIndex": 7,
            "func": "hex",
            "parsed": {
                "funcType": "color",
                "type": "hex",
                "r": 255,
                "g": 255,
                "b": 255,
                "a": 1,
                "h": 0,
                "s": 0,
                "l": 100
            }
        },
        {
            "matchedString": "white",
            "startIndex": 8,
            "endIndex": 13,
            "func": "color-name",
            "parsed": {
                "funcType": "color",
                "type": "rgb",
                "r": 255,
                "g": 255,
                "b": 255,
                "a": 1,
                "h": 0,
                "s": 0,
                "l": 100
            }
        },
        {
            "matchedString": "rgba(255, 255, 0.1, 0.5)",
            "startIndex": 14,
            "endIndex": 38,
            "func": "rgba",
            "args": "255, 255, 0.1, 0.5",
            "parameters": [
                "255",
                "255",
                "0.1",
                "0.5"
            ],
            "parsed": {
                "funcType": "color",
                "type": "rgb",
                "r": 255,
                "g": 255,
                "b": 0,
                "a": 0.5,
                "h": 60,
                "s": 100,
                "l": 50
            }
        },
        {
            "matchedString": "hsl(360, 0.1, 0.1)",
            "startIndex": 40,
            "endIndex": 58,
            "func": "hsl",
            "args": "360, 0.1, 0.1",
            "parameters": [
                "360",
                "0.1",
                "0.1"
            ],
            "parsed": {
                "funcType": "color",
                "type": "hsl",
                "h": 360,
                "s": 0.1,
                "l": 0.1,
                "a": 1,
                "r": 0,
                "g": 0,
                "b": 0
            }
        }
    ]);

})

test("create css function parser", () => {
    const result = parseValue('linear-gradient( #FFFFFF white steps(5, step-start))')
    // console.log(JSON.stringify(result, null, 2))
    expect(result[0].parsedParameters[0][0].matchedString).toEqual('#FFFFFF');

})

test("create linear-gradient parser", () => {
    const result = parseValue('linear-gradient( #FFFFFF, white)')



    // console.log(JSON.stringify(result, null, 2))
    expect(result[0].func).toEqual('linear-gradient');
})

test("create css linear-gradient parser with offset and color", () => {
    const result = parseValue('linear-gradient(to right, rgb(255, 0, 0) 0%, blue 100%)')

    // console.log(JSON.stringify(result, null, 2))

    expect(result[0].parameters.length).toEqual(3);
    expect(result[0].parsedParameters[1].length).toEqual(2);
})

test("create timing function", () => {
    const result = parseValue('linear-gradient(to right, rgb(255, 0, 0) 0%, blue 100% ease 10)')

    expect(result[0].parameters.length).toEqual(3);
    expect(result[0].parsedParameters[2].length).toEqual(4);
})

test("create timing function - ease", () => {
    const result = parseValue("ease");

    expect(result).toEqual([
        {
          matchedString: 'ease',
          startIndex: 0,
          endIndex: 4,
          func: 'ease',
          parsed: {
            funcType: 'timing',
            name: 'ease',
            matchedString: 'ease',
            x1: 0.25,
            y1: 0.1,
            x2: 0.25,
            y2: 1
          }
        }
    ]);
})

test("create timing function - linear", () => {
    const result = parseValue("linear");

    expect(result).toEqual([
        {
            "matchedString": "linear",
            "startIndex": 0,
            "endIndex": 6,
            "func": "linear",
            "parsed": {
                "funcType": "timing",
                "name": "linear",
                "matchedString": "linear",
                "x1": 0,
                "y1": 0,
                "x2": 1,
                "y2": 1
            }
        }
    ]);
})
