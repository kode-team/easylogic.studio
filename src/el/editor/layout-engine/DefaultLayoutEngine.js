import { Constraints, ConstraintsDirection } from "el/editor/types/model";

export default {

    startCache (container) {
        // 이전 크기 캐싱 
        container.addCache("cachedSize", {
            width: container.width,
            height: container.height
        });

        // 자식 캐싱 
        container.addCache("cachedLayerMatrix", container.layers.map(child => {
            child.startToCacheChildren();

            return {
                id: child.id,
                matrix: child.attrs('x', 'y', 'width', 'height'),
                constraints: {
                    horizontal: child[ConstraintsDirection.HORIZONTAL],
                    vertical: child[ConstraintsDirection.VERTICAL]
                }

            }
        }))
    },

    recover (container) {

        const obj = {
            width: container.width,
            height: container.height
        }

        const currentContainerWidth = obj.width;
        const currentContainerHeight = obj.height;

        const cachedSize = container.getCache("cachedSize");
        const oldContainerWidth = cachedSize.width;
        const oldContainerHeight = cachedSize.height;

        const scaleX = currentContainerWidth / oldContainerWidth;
        const scaleY = currentContainerHeight / oldContainerHeight;

        const cachedLayerMatrix = container.getCache("cachedLayerMatrix");

        // 자식 layers 들을 scaleX, scaleY 에 따라 모두 복원한다. 
        cachedLayerMatrix.forEach(({ id, matrix, constraints }) => {

            // container 내부에 있는 자식 조회 
            const item = container.find(id);
            const { x, y, width, height } = matrix;

            const left = x;
            const right = oldContainerWidth - x - width;
            const top = y;
            const bottom = oldContainerHeight - y - height;

            const localObj = {}

            // constraints horizontal
            switch (constraints.horizontal) {
                case Constraints.MIN:
                    localObj.x = left;
                    break;
                case Constraints.MAX:
                    localObj.x = currentContainerWidth - right - width;
                    break;
                case Constraints.STRETCH:
                    localObj.x = left;
                    localObj.width = currentContainerWidth - left - right;
                    break;
                case Constraints.SCALE:
                    localObj.x = left * scaleX;
                    localObj.width = width * scaleX;
                    break;
                case Constraints.CENTER:
                    const halfWidth = width / 2;
                    const scaleNew = x + halfWidth / oldContainerWidth;

                    localObj.x = scaleNew * currentContainerWidth - halfWidth * scaleX;
                    break;
            }

            // constraints vertical
            switch (constraints.vertical) {
                case Constraints.MIN:
                    localObj.y = top;
                    break;
                case Constraints.MAX:
                    localObj.y = currentContainerHeight - bottom - height;
                    break;
                case Constraints.STRETCH:
                    localObj.y = top;
                    localObj.width = currentContainerHeight - top - bottom;
                    break;
                case Constraints.SCALE:
                    localObj.y = top * scaleY;
                    localObj.height = height * scaleY;
                    break;
                case Constraints.CENTER:
                    const halfHeight = height / 2;
                    const scaleNew = y + halfHeight / oldContainerHeight;

                    localObj.y = scaleNew * currentContainerHeight - halfHeight * scaleY;
                    break;
            }

            item.reset(localObj)

            item.recoverChildren();
        })
    }
}