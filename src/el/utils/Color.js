import * as formatter from "./formatter";
import * as create from "./create";
import * as math from './math'
import * as fromRGB from './fromRGB'
import * as fromCMYK from './fromCMYK'
import * as fromLAB from './fromLAB'
import * as fromHSV from './fromHSV'
import * as fromHSL from './fromHSL'
import * as fromYCrCb from './fromYCrCb'
import * as mixin from "./mixin";
import * as parser from "./parser";
import * as func from './func';

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
    ...func
}

