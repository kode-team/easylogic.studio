export function makeInterpolateNumber(layer, property, startNumber, endNumber, unit = undefined) {

    return (rate, t) => {
        if (t === 0) {
            return startNumber;
        } else if (t === 1) {
            return endNumber;
        }


        var result = startNumber + (endNumber - startNumber) * rate

        if (unit) {
            return result + unit; 
        }

        return result; 
    }
}
