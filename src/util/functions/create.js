import { rgb } from "./formatter";

export function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function random() {
    return rgb({
        r: randomNumber(0, 255),
        g: randomNumber(0, 255),
        b : randomNumber(0, 255),
    })
}