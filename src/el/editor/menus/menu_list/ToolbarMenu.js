import DefaultMenu from "./toolbar/DefaultMenu";
import RightMenu from "./toolbar/RightMenu";

export default {
    left: () => {
        return DefaultMenu
    },

    center: () => {
        return [
            {
                type: 'button',
                icon: 'navigation',
                action: (editor) => {
                    editor.emit('addCubeBox');
                }
            },
        ]
    },

    right: () => {
        return RightMenu;
    }

}