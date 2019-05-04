const CONSTANT = {

    identity () {
        return [
            1, 0, 0,
            0, 1, 0,
            0, 0, 1 
        ]
    },

    stretching (k) {
        return [
            k, 0, 0,
            0, 1, 0,
            0, 0, 1
        ]
    },

    squeezing (k) {
        return [
            k, 0, 0,
            0, 1/k, 0,
            0, 0, 1
        ]
    },

    scale (sx = 1, sy = 1) {
        sx = sx || sx === 0 ? sx : 1;
        sy = sy || sy === 0 ? sy : 1;
        return [
            sx, 0, 0,
            0, sy, 0,
            0, 0, 1
        ]
    },

    scaleX (sx) {
        return this.scale(sx)
    },

    scaleY (sy) {
        return this.scale(1, sy)
    },    

    translate (tx, ty) {
        return [
            1, 0, tx,
            0, 1, ty,
            0, 0, 1
        ]
    },

    rotate (angle){
        const r = this.radian(angle)
        return [
            Math.cos(r), -Math.sin(r), 0,
            Math.sin(r), Math.cos(r), 0,
            0, 0, 1
        ]
    },

    rotate90 () {
        return [
            0, -1, 0,
            1, 0, 0,
            0, 0, 1
        ]
    },

    rotate180 () {
        return [
            -1, 0, 0,
            0, -1, 0,
            0, 0, 1
        ]
    },    

    rotate270 () {
        return [
            0, 1, 0,
            -1, 0, 0,
            0, 0, 1
        ]
    },        

    radian (degree) {
        return degree * Math.PI / 180
    },

    skew (degreeX, degreeY) { 
        const radianX = this.radian(degreeX);
        const radianY = this.radian(degreeY);
        return [
            1, Math.tan(radianX), 0, 
            Math.tan(radianY), 1, 0,
            0, 0, 1 
        ]
    },

    skewX (degreeX) {
        const radianX = this.radian(degreeX);
        
        return [
            1, Math.tan(radianX), 0, 
            0, 1, 0,
            0, 0, 1 
        ]
    },

    skewY (degreeY) {
        const radianY = this.radian(degreeY);
        
        return [
            1, 0, 0, 
            Math.tan(radianY), 1, 0,
            0, 0, 1 
        ]
    },    

    shear1 (angle) {
        return [
            1, -Math.tan(this.radian(angle)/2), 0,
            0, 1, 0,
            0, 0, 1
        ]
    }, 
    shear2 (angle) {
        return [
            1, 0, 0,
            Math.sin(this.radian(angle)), 1, 0,
            0, 0, 1
        ]
    }
}

const Matrix = {
    CONSTANT,

    radian (angle) {
        return CONSTANT.radian(angle)
    },

    multiply (A, C) {        
        // console.log(JSON.stringify(A), JSON.stringify(C))
        return [   
            A[0] * C[0] + A[1] * C[1] + A[2] * C[2], 
            A[3] * C[0] + A[4] * C[1] + A[5] * C[2],
            A[6] * C[0] + A[7] * C[1] + A[8] * C[2]
        ]
    },

    identity (B) {
        return this.multiply(CONSTANT.identity(), B)
    },

    translate (x, y, B) {
        return this.multiply(
            CONSTANT.translate(x, y),
            B
        )
    },

    rotate (angle, B) {
        return this.multiply(
            CONSTANT.rotate(angle),
            B
        )
    },

    shear1 (angle, B) {
        return this.multiply(
            CONSTANT.shear1(angle),
            B
        )
    },

    shear2 (angle, B) {
        return this.multiply(
            CONSTANT.shear2(angle),
            B
        )
    },    

    rotateShear(angle, B) {

        let arr = B 

        arr = this.shear1(angle, arr)
        arr = this.shear2(angle, arr)
        arr = this.shear1(angle, arr)

        return arr
    }
}

export default Matrix 