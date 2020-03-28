import { isFunction } from "../../util/functions/func";

/**
 * set attribute command 
 * 
 * @param {Editor} editor 
 * @param {Array} attr - attrs 적용될 속성 객체 
 * @param {Array<string>} ids 아이디 리스트 
 * @param {Boolean} isChangeFragment 중간 색상 변화 여부 
 */
export default function setAttribute (editor, attrs, ids = null, isChangeFragment = false, isBoundSize = false) {
    editor.selection.itemsByIds(ids).forEach(item => {

        Object.keys(attrs).forEach(key => {
            const value = attrs[key];
            if (isFunction(value)) {
                value = value();
            }

            item.reset({ [key] : value });
        })

        editor.emit('refreshElement', item, isChangeFragment, isBoundSize);
    });
}