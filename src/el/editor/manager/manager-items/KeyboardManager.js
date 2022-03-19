/**
 * @class KeyBoardManager 
 */
export class KeyBoardManager {
    constructor (editor) {
        this.editor = editor; 
        this.codeSet = new Set();
        this.keyCodeSet = new Set();
    }

    /**
     * 키 이벤트가 발생 했을 때 키, 키코드 추가 하기 
     * 
     * @param {string} key 
     * @param {number} keyCode 
     */
    add (key, keyCode) {

        if (this.codeSet.has(key) === false) {
            this.codeSet.add(key);
        }

        if (this.keyCodeSet.has(keyCode) === false) {
            this.keyCodeSet.add(keyCode);
        }

    }

    remove (key, keyCode) {
        this.codeSet.delete(key);
        this.keyCodeSet.delete(keyCode);
    }

    /**
     * 눌러진 키 체크하기 
     * @param {string|number} keyOrKeyCode 
     */
    hasKey (keyOrKeyCode) {
        return this.codeSet.has(keyOrKeyCode) || this.keyCodeSet.has(keyOrKeyCode)
    }

    /**
     * key, keycode 가 눌러져있는지 체크 
     * @param {string|number} keyOrKeyCode 
     */
    check (...args) {
        return args.some(keyOrKeyCode => this.hasKey(keyOrKeyCode))
    }
}