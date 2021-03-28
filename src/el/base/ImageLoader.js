import Canvas from './Canvas'
import { isString } from './functions/func';


class ImageLoader {
    constructor(url, opt = {}) {
        this.isLoaded = false; 
        this.imageUrl = url; 
        this.opt = opt;
        this.initialize();
    }

    initialize () {
        this.canvas = this.createCanvas();
        this.context = this.canvas.getContext('2d');
    }

    createCanvas () {
        return document.createElement('canvas');
    }

    load (callback) {
        this.loadImage(callback);
    }

    loadImage (callback) {

        this.getImage( (img) => {
            var ctx = this.context;             
            var ratio = img.height / img.width;

            if (this.opt.canvasWidth && this.opt.canvasHeight) {
                this.canvas.width = this.opt.canvasWidth;
                this.canvas.height = this.opt.canvasHeight;
            } else {
                this.canvas.width = this.opt.maxWidth ? this.opt.maxWidth : img.width;
                this.canvas.height = this.canvas.width * ratio; 
            }

            ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, this.canvas.width, this.canvas.height);
            this.isLoaded = true; 
            callback && callback();
        })
    }

    getImage (callback) {

        this.newImage = new Image();
        const img = this.newImage
        img.onload = () => {
            callback && callback(img);
        };

        img.onerror = (e) => {
            console.log(e, img.src);
        }

        this.getImageUrl(function (url) {
            img.src = url;
        });
    }

    load (callback) {
        this.newImage = new Image();
        const img = this.newImage
        img.crossOrigin = "Anonymous";
        img.onload = () => {
            this.isLoaded = true; 
            callback && callback();
        };

        this.getImageUrl(function (url) {
            img.src = url;
        });
    }

    getImageUrl (callback) {
        if (isString(this.imageUrl)) {
            return callback(this.imageUrl);
        } else if (this.imageUrl instanceof Blob) {
            var reader = new FileReader();

            reader.onload = function (ev) {
                callback (ev.target.result);
            }

            reader.readAsDataURL(this.imageUrl);
        }
    }

    getRGBA (r, g, b, a) {
        return [r, g, b, a];
    }

    toArray(filter, callback, opt = {}) {
        var imagedata = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
        var width = imagedata.width;
        var height = imagedata.height; 

        var pixels = new Uint8ClampedArray(imagedata.data);

        let bitmap = {  pixels, width, height }

        if (!filter) {
            filter = (function () {
                return (bitmap, done) => {
                    done(bitmap)
                }
            })()
        }

        filter(bitmap, function (newBitmap) {
            var tmpCanvas = Canvas.drawPixels(newBitmap);

            if (opt.returnTo == 'canvas') {
                callback(tmpCanvas)
            } else {
                callback(tmpCanvas.toDataURL(opt.outputFormat || 'image/png'))
            }

        }, opt)
    } 

    toHistogram (opt) {
        var imagedata = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
        var width = imagedata.width;
        var height = imagedata.height; 

        var pixels = new Uint8ClampedArray(imagedata.data);

        let bitmap = { pixels, width, height }        

        return Canvas.getHistogram(bitmap)
    }

    toRGB () {
        var imagedata = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);

        var rgba = imagedata.data;
        var results = [];
        for (var i = 0, len = rgba.length; i < len; i += 4){
            results[results.length] = [rgba[i + 0],rgba[i + 1],rgba[i + 2],rgba[i + 3]];
        }

        return results; 
    }


}

export default ImageLoader;