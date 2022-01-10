import { CONFIG } from 'el/sapa/Event';
import Dom from 'el/sapa/functions/Dom';

export default {
    command : 'config:bodyEvent',
    description: 'fire when bodyEvent was set',
    execute : function (editor) {

        const $target = Dom.create(editor.config.get('bodyEvent').target);

        editor.config.init('onMouseMovepageContainer', $target);
    }
}