export default function (size = 20) {
    return `
        background-image: repeating-linear-gradient(to right, currentColor 0px, currentColor 1px, transparent 1px, transparent 100%);
        background-size: ${size}px ${size}px;
    `
}