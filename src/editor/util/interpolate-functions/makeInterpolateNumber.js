export function makeInterpolateNumber(layer, property, startNumber, endNumber) {

    return (rate, t) => {
        if (t === 0) {
            return startNumber;
        } else if (t === 1) {
            return endNumber;
        }

        return startNumber + (endNumber - startNumber) * rate
    }
}
