import CirclePatternPopup from './popup/CirclePatternPopup';

/**
 * 
 * @param {Editor} editor 
 */
 export default function (editor) {
    editor.registerMenuItem('popup', {
        CirclePatternPopup
    });
}