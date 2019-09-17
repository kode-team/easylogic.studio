import { MovableItem } from "./MovableItem";

export default class AreaItem extends MovableItem {
    getDefaultObject(obj = {}) {
        return {
            selected: false,  // 선택 여부 체크 
            layers: [],   // 하위 객체를 저장한다. 
            ...obj
        };
    }
}