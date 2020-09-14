import { makeInterpolateBoolean } from "./makeInterpolateBoolean";

export function makeInterpolateString (layer, property, startString, endString)  {
    return makeInterpolateBoolean(layer, property, startString, endString)
}
