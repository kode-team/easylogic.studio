export default function (transform = '') {
    return /*html*/`
        <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" viewBox="0 0 24 24" width="18" height="18" >
            <polygon points="21,11 21,3 13,3 16.29,6.29 6.29,16.29 3,13 3,21 11,21 7.71,17.71 17.71,7.71" transform='${transform}' stroke='white' stroke-width="0.5" />
        </svg>
    `
}