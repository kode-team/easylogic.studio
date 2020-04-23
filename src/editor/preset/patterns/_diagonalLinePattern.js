export default function (size = 20) {
    return `
        background-image: repeating-linear-gradient(45deg, currentColor 0, currentColor 1px, transparent 0, transparent 50%);
        background-size: ${size}px ${size}px;
    `
}