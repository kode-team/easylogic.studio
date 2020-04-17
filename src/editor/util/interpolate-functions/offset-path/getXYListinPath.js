import { getXYinPath } from "./getXYinPath";

export function getXYListinPath (parser, count = 100) {
    const xy = getXYinPath(parser);

    const useList = [] 
    for(var i = 0; i <= count; i++) {
      useList.push(xy(i/count))
    }

    return useList;
}
