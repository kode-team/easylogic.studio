export class Segment {
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
}