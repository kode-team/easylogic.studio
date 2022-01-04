import DefaultMenu from "./toolbar/DefaultMenu";
import RightMenu from "./toolbar/RightMenu";

export default {
    left: () => {
        return DefaultMenu
    },

    center: () => {
        return []
    },

    right: () => {
        return RightMenu;
    }

}