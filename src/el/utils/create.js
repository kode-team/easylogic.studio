import { rgb } from "./formatter";

export function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomByCount (count = 1) {
    let arr = []
    for(var i = 0; i < count; i++) {
        arr[arr.length] = random();
    }

    return arr; 
}

export function random() {
    return rgb({
        r: randomNumber(0, 255),
        g: randomNumber(0, 255),
        b : randomNumber(0, 255),
    })
}

export function randomRGBA() {
    return rgb({
        r: randomNumber(0, 255),
        g: randomNumber(0, 255),
        b: randomNumber(0, 255),
        a: randomNumber(0, 1000)/1000,
    })
}