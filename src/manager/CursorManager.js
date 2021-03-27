import { isFunction } from "@sapa/functions/func";
import icon from "@icon/icon";

export class CursorManager {

    async load (iconName = 'default', ...args) {
        if (icon[iconName]) {
            
            const iconContent = isFunction(icon[iconName]) ? icon[iconName].call(icon[iconName], ...args) : icon[iconName]
            const blob = new Blob([iconContent], {type: 'image/svg+xml'});

            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const datauri = e.target.result; 
                    resolve(`url(${datauri}) 12 12, auto`)
                }
                reader.readAsDataURL(blob);
            })

        } else {
            return iconName;
        }

    }
}