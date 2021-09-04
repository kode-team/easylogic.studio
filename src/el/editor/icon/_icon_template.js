export default function _icon_template (tpl, opt) {

    const defaultOpts = Object.assign({
        width: 24, 
        height: 24
    }, opt);

    return /*html*/`
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="${defaultOpts.width}" 
            height="${defaultOpts.height}" 
            viewBox="0 0 24 24">${tpl}</svg>`;
}