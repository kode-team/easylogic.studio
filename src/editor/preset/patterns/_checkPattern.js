export default function (size = 20) {
    return `
        background-image: repeating-linear-gradient(45deg, currentColor 25%, transparent 25%, transparent 75%, currentColor 75%, currentColor 100%),repeating-linear-gradient(45deg, currentColor 25%, transparent 25%, transparent 75%, currentColor 75%, currentColor 100%);
        background-position: 0px 0px, ${size/2}px ${size/2}px;
        background-size: ${size}px ${size}px, ${size}px ${size}px;
    `
}