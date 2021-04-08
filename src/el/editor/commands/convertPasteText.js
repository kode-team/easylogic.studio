import urlParser from "js-video-url-parser";
import { Length } from "../unit/Length";

export default {
    command: 'convertPasteText',
    execute: async (editor, text) => {

        const embedUrl = urlParser.create({ 
            videoInfo: urlParser.parse(text), 
            format: 'embed',
            mediaType: 'clip'
        });

        if (embedUrl) {
 
            const center = editor.viewport.center;
            const width = 300;
            const height = 200; 

            editor.emit('newComponent', 'iframe', {
              x: Length.px(center[0] - width/2),
              y: Length.px(center[1] - height/2),
              width: Length.px(width),
              height: Length.px(height),
              'background-color': 'transparent',
              url: embedUrl
            });
        }

    }
}