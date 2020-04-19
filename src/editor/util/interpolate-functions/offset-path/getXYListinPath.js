import { getXYinPath } from "./getXYinPath";

/**
 * path 에서 특정 위치를 나눠서 리턴해준다. 
 * 
 * @param {*} parser 
 * @param {*} count 
 * @param {*} distance 
 */
export function getXYListinPath (parser, count = 100, distance = 0) {
    const {totalLength, xy} = getXYinPath(parser);

    const unitLength = totalLength/count
    const distanceT = distance/totalLength;
    const unitT = unitLength/totalLength + distanceT;

    const useList = [] 
    const maxT = 1; 
    for(var i = 0; i < count; i++) {
      const currentT = i * unitT; 

      if (currentT > maxT) break; 

      useList.push(xy(currentT))
    }

    return useList;
}
