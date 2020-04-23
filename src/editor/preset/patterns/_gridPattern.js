export default function (size = 20) {
    return `
        background-image: linear-gradient(currentColor 1px, transparent 1px),linear-gradient(to right, currentColor 1px, transparent 1px);
        background-size: ${size/2}px ${size/2}px,${size/2}px ${size/2}px;
    `
}