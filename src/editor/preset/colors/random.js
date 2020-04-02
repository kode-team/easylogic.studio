import Color from "../../../util/Color";

export default { 
    title: 'random', 
    key: 'random', 
    execute: function (count = 20) {
        return Color.randomByCount(count).map(color => {
            return { color }
        });
    } 
}