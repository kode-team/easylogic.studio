import { parseParamNumber } from "../filter/functions";
import Scale from "./Scale";
import ValueGenerator from "./ValueGenerator";
import { UNIT_PX, EMPTY_STRING } from "../css/types";
import { keyMap, keyEach } from "../functions/func";

const KeyFrames = {
    parse (obj, ani) {
        var list = keyMap(obj, (key, originAttrs) => {
            var attrs = {...originAttrs};
            var percent = 0; 
            if (key == 'from') {
                key = '0%';
            } else if (key == 'to') {
                key = '100%';
            }

            if (key.includes('%')) {
                percent = parseParamNumber(key) / 100; 
            } else {
                var newKey = +key; 

                if (newKey + EMPTY_STRING == key) {
                    // 시간 초 단위 
                    percent = (newKey / ani.duration )
                }
            }

            return { 
                percent,
                attrs,
                originAttrs
            }
        })

        return this.parseTiming(...this.parseAttrs(...list));
    },

    parseTiming (...list) {
        var transitionProperties = {} 
        list.forEach(item => {
            keyEach(item.attrs, (property) => {
                transitionProperties[property] = true; 
            });
        })

        var keyValueMapping = keyMap(transitionProperties, property => {
            return list.filter(it => it.attrs[property]).map(it => it.attrs[property])
        }).filter(it => {
            return it.length; 
        })

        return keyValueMapping.map(transitionPropertyItem => {
            var functions = [];

            for(var i = 0, len = transitionPropertyItem.length -1 ; i < len; i++) {
                functions.push (Scale.makeSetupFunction(
                    transitionPropertyItem[i], 
                    transitionPropertyItem[i+1], 
                    (len - 1)  == i
                ))
            }

            return {
                functions,
                type: transitionPropertyItem[0].itemType || UNIT_PX,
                values: transitionPropertyItem
            }; 
        })
    },

    parseAttrs (...list) {
        list.sort((a, b) => {
            if (a.percent == b.percent) return 0; 
            return a.percent > b.percent ? 1 : -1; 
        })

        list = list.map ((item, index) => {
            keyEach(item.attrs, (key, value) => {
                item.attrs[key] = ValueGenerator.make(key, item.percent, value); 
            })

            return item;
        })

        return list; 
    }
}


export default KeyFrames;