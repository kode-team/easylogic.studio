export function makeInterpolateString (layer, property, startString, endString) {

    return (ratio, t) => {

        if (t === 1) {
            return endString;
        }

        return startString
    } 
}
