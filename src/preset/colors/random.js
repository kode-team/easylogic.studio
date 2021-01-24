import Color from "@core/Color";
import HueColor from "@core/HueColor";

export default { 
    title: 'random', 
    key: 'random', 
    execute: function (count = 42) {
        const colorList = Color.randomByCount(count).map(color => {
            return { color }
        });

        colorList.sort((a, b) => {

            const localA = Color.parse(a.color)
            const localB = Color.parse(b.color);

            return localA.h > localB.h ? 1 : -1;
        })

        return colorList;
    } 
}