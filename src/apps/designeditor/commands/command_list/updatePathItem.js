import { mat4, vec3 } from "gl-matrix";

import { rectToVerties } from "elf/core/collision";
import {
  vertiesMap,
  calculateMatrix,
  calculateMatrixInverse,
} from "elf/core/math";
import { PathParser } from "elf/core/parser/PathParser";
import { Transform } from "elf/editor/property-parser/Transform";

export default {
  command: "updatePathItem",

  description: "Update path string for selected svg path item",

  /**
   *
   * @param {Editor} editor
   * @param {object} pathObject
   * @param {string} pathObject.d    svg path 문자열
   * @param {object} pathObject.matrix    svg path 문자열
   */
  execute: function (editor, pathObject) {
    const current = editor.context.selection.current;
    if (current) {
      if (pathObject.box === "box") {
        const newPath = current.invertPath(pathObject.d);

        // d 속성 (path 문자열) 을 설정한다.
        editor.context.commands.executeCommand(
          "setAttribute",
          "change local path",
          editor.context.selection.packByValue({
            d: newPath.d,
          })
        );
      } else {
        const newPath = new PathParser(pathObject.d);
        // 1. 로컬 좌표로 변환
        newPath.transformMat4(pathObject.matrix.absoluteMatrixInverse);

        // 2. 로컬 좌표로 bbox 구하기
        let bbox = newPath.getBBox();

        // 3. newWidth, newHeight 구하기
        const newWidth = vec3.distance(bbox[1], bbox[0]);
        const newHeight = vec3.distance(bbox[3], bbox[0]);

        // 4. bbxo 를 월드 좌표로 변환
        let oldBBox = vertiesMap(
          rectToVerties(bbox[0][0], bbox[0][1], newWidth, newHeight),
          pathObject.matrix.absoluteMatrix
        );

        // 5. 월드 좌표에서 로컬 transform 의 역행렬을 적용, 월드 좌표에서 translate 를 구함
        //    이 때 translate 를 모르기 때문에 origin 을 bbox를 중심으로 새로 구해서 적용
        let newBBox = vertiesMap(
          oldBBox,
          calculateMatrixInverse(
            mat4.fromTranslation([], oldBBox[4]),
            Transform.createTransformMatrix(
              Transform.parseStyle(pathObject.matrix.transform),
              newWidth,
              newHeight
            ),
            mat4.fromTranslation([], vec3.negate([], oldBBox[4]))
          )
        );

        // 6. 월드 좌표로 변환된 bbox 의 중심으로 새로운 matrix 를 구함
        const worldMatrix = calculateMatrix(
          mat4.fromTranslation([], newBBox[0]),
          current.getLocalTransformMatrix(newWidth, newHeight)
        );

        // 7. 월드 좌표에서 부모의 상대 좌표로 변환
        const realXY = mat4.getTranslation(
          [],
          calculateMatrix(
            pathObject.matrix.parentMatrixInverse,
            worldMatrix,
            mat4.invert(
              [],
              current.getLocalTransformMatrix(newWidth, newHeight)
            )
          )
        );

        // d 속성 (path 문자열) 을 설정한다.
        editor.context.commands.executeCommand(
          "setAttribute",
          "change path",
          editor.context.selection.packByValue({
            // bbox 가 기존 좌표에서 움직인 상태 이기 때문에
            // bbox 시작점만큼 이동해서 newWidth, newHeight 기준으로 path 를 맞춘다.
            d: newPath.translate(-bbox[0][0], -bbox[0][1]).d,
            x: realXY[0],
            y: realXY[1],
            width: newWidth,
            height: newHeight,
          })
        );
      }
    }
  },
};
