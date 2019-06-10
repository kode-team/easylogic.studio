import * as formatter from "./functions/formatter";
import * as create from "./functions/create";
import * as math from './functions/math'
import * as fromRGB from './functions/fromRGB'
import * as fromCMYK from './functions/fromCMYK'
import * as fromLAB from './functions/fromLAB'
import * as fromHSV from './functions/fromHSV'
import * as fromHSL from './functions/fromHSL'
import * as fromYCrCb from './functions/fromYCrCb'
import * as mixin from "./functions/mixin";
import * as parser from "./functions/parser";
// import * as image from "./functions/image";
import * as func from './functions/func';

export default {
    ...create,
    ...formatter, 
    ...math, 
    ...mixin,
    ...parser,
    ...fromYCrCb,
    ...fromRGB,
    ...fromCMYK,
    ...fromHSV,
    ...fromHSL,
    ...fromLAB,
    // ...image,
    ...func
}

