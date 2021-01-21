import _icon_template from "./_icon_template";

export default function (transform = '') {
    return /*html*/_icon_template(`<polygon points="21,11 21,3 13,3 16.29,6.29 6.29,16.29 3,13 3,21 11,21 7.71,17.71 17.71,7.71" transform='${transform}' stroke='white' stroke-width="0.5" />`, {width: 20, height: 20});
}