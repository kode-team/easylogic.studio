
export function makeInterpolateBoolean (layer, property, startBoolean, endBoolean) {

    return (ratio, t) => {

        if (t === 1) {
            return endBoolean;
        }

        return startBoolean
    } 
}
