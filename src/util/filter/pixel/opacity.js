import {
    parseParamNumber,
    pixel
} from '../functions'


export default function opacity (amount = 100) {
    amount = parseParamNumber(amount)   
    const $C = amount / 100; 

    return pixel(() => {
        $a *= $C 
    }, { $C })
}