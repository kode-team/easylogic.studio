import { Length } from "./Length";

export class DirectionLength {
    static parse (str) {
        var temp = str.split(' ').filter(it => it.trim()).map(it => Length.parse(it))

        var top = Length.percent(0), right = Length.percent(0), bottom = Length.percent(0), left = Length.percent(0);

        if (temp.length === 1) {
            top = temp[0].clone()
            right = temp[0].clone()
            bottom = temp[0].clone()
            left = temp[0].clone()
        } else if (temp.length === 2) {
            top = temp[0].clone()
            right = temp[1].clone()
            bottom = temp[0].clone()
            left = temp[1].clone()            
        } else if (temp.length === 3) {
            top = temp[0].clone()
            right = temp[1].clone()
            bottom = temp[2].clone()
            left = temp[1].clone()  
        } else if (temp.length === 4) {
            top = temp[0].clone()
            right = temp[1].clone()
            bottom = temp[2].clone()
            left = temp[3].clone()
        }

        return [temp.length, top, right, bottom, left]
    }
}