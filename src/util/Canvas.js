import Color from './Color'
import { isFunction } from './functions/func';

function each(len, callback) {
    for (var i = 0; i < len; i += 4) {
        callback(i);
    }
}

function pack(bitmap, callback) {

    each(bitmap.pixels.length, (i) => {
        callback(bitmap.pixels, i)
    })
}

const Canvas = {

    create (width, height) {
        var canvas = document.createElement('canvas');
        canvas.width = width || 0;
        canvas.height = height || 0;

        return canvas; 
    },

    drawPixels(bitmap) {
        var canvas = this.create(bitmap.width, bitmap.height);

        var context = canvas.getContext('2d');
        var imagedata = context.getImageData(0, 0, canvas.width, canvas.height);

        imagedata.data.set(bitmap.pixels);

        context.putImageData(imagedata, 0, 0);

        return canvas;
    },

    createHistogram (width, height, histogram, callback, opt = { black: true, red: false, green : false, blue: false}) {
        var canvas = this.create(width, height)
        const context = canvas.getContext('2d')
        context.clearRect(0, 0, width, height)
        context.fillStyle = "white"
        context.fillRect(0, 0, width, height)
        context.globalAlpha = 0.7

        var omit = { black: false }
        if (opt.black) {omit.black = false  } else {omit.black = true}
        if (opt.red) {omit.red = false  } else {omit.red = true}
        if (opt.green) {omit.green = false  } else {omit.green = true}
        if (opt.blue) {omit.blue = false  } else {omit.blue = true} 


        Object.keys(histogram).forEach(color => {

            if (!omit[color]) {

                var array = histogram[color]
                const ymax = Math.max.apply(Math, array)
                const unitWith = width / array.length 
    
                context.fillStyle = color
                array.forEach((it, index) => {
                    const currentHeight = height * (it / ymax) 
                    const x = index * unitWith 
        
                    context.fillRect(x, height - currentHeight, unitWith, currentHeight);
                });
            }

        })


        if (isFunction(callback)) callback(canvas)

    },

    getHistogram (bitmap) {
        let black = new Array(256)
        let red = new Array(256)
        let green = new Array(256)
        let blue = new Array(256)
        for(var i = 0; i < 256; i++) {
            black[i] = 0
            red[i] = 0
            green[i] = 0
            blue[i] = 0
        }

        pack(bitmap, (pixels, i) => {
            // gray scale 
            const grayIndex = Math.round(Color.brightness(pixels[i], pixels[i+1], pixels[i+2]))
            black[grayIndex]++

            red[pixels[i]]++
            green[pixels[i+1]]++
            blue[pixels[i+2]]++

        })

        return {black, red, green, blue } 
    },

    getBitmap(bitmap, area) {
        var canvas = this.drawPixels(bitmap);

        var context = canvas.getContext('2d');
        var pixels = context.getImageData(area.x || 0, area.y || 0, area.width || canvas.width, area.height || canvas.height).data;

        return { pixels, width: area.width, height: area.height };
    },

    putBitmap(bitmap, subBitmap, area) {

        var canvas = this.drawPixels(bitmap);
        var subCanvas = this.drawPixels(subBitmap);

        var context = canvas.getContext('2d');
        context.drawImage(subCanvas, area.x, area.y);

        bitmap.pixels = context.getImageData(0, 0, bitmap.width, bitmap.height).data;

        return bitmap;
    }

}

export default Canvas;