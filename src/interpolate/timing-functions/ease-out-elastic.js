export default function () {
    return (rate) => {
        return Math.pow(2, -10 * rate) * Math.sin((rate - .1) * 5 * Math.PI) + 1;
    }
    
}