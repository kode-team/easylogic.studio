
/**
 * segment 객체 생성기 
 * @class
 */
export class Segment {

    static M(x, y) {
        return {
            command: 'M', values: [x, y]
        }
    }

    static L(x, y) {
        return {
            command: 'L', values: [x, y]
        }
    }

    static Q(x1, y1, x, y) {
        return {
            command: 'Q', values: [x1, y1, x, y]
        }
    }

    static C(x1, y1, x2, y2, x, y) {
        return {
            command: 'C', values: [x1, y1, x2, y2, x, y]
        }
    }

    static Z() {
        return {
            command: "Z", values: [] // closed path
        }
    }
}