import setAttribute from "./setAttribute";

/**
 * set attribute command for Sync 
 * 
 * @param {Editor} editor 
 * @param {Array} attr - attrs 적용될 속성 객체 
 * @param {Array<string>} ids 아이디 리스트 
 * @param {Boolean} isChangeFragment 중간 색상 변화 여부 
 */
export default function setAttributeSync (...args) {
    setAttribute(...args)
}