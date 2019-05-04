import kmeans from "../Kmeans";
import ImageLoader from "../ImageLoader";
import Canvas from "../Canvas";
// import GL from '../GL'
import { format } from "./formatter";
import { isFunction } from "./func";

export function palette(colors, k = 6, exportFormat = "hex") {
  if (colors.length > k) {
    colors = kmeans(colors, k);
  }

  return colors.map(c => {
    return format(c, exportFormat);
  });
}

export function ImageToRGB(url, callbackOrOption = {}, callback) {
  if (!callback) {
    var img = new ImageLoader(url);
    img.loadImage(() => {
      if (isFunction(callbackOrOption)) {
        callbackOrOption(img.toRGB());
      }
    });
  } else if (callback) {
    var img = new ImageLoader(url, callbackOrOption);
    img.loadImage(() => {
      if (isFunction(callback)) {
        callback(img.toRGB());
      }
    });
  }
}

export function ImageToCanvas(
  url,
  filter,
  callback,
  opt = { frameTimer: "full" }
) {
  ImageToURL(url, filter, callback, { returnTo: "canvas", ...opt });
}

export function ImageToURL(
  url,
  filter,
  callback,
  opt = { frameTimer: "full" }
) {
  var img = new ImageLoader(url);
  img.loadImage(() => {
    img.toArray(
      filter,
      function(datauri) {
        if (isFunction(callback)) {
          callback(datauri);
        }
      },
      opt
    );
  });
}

// export function GLToCanvas (url, filter, callback, opt = {}) {
//     var img = new ImageLoader(url);
//     img.load(() => {
//         GL.filter(img.newImage, filter, function done (datauri) {
//             if (isFunction(callback)) {
//                 callback(datauri)
//             }
//         }, opt)
//     })
// }

export function histogram(url, callback, opt = {}) {
  var img = new ImageLoader(url);
  img.loadImage(() => {
    if (isFunction(callback)) {
      callback(img.toHistogram(opt));
    }
  });
}

export function histogramToPoints(points, tension = 0.2) {
  var controlPoints = [];
  for (let i = 0; i < points.length; i++) {
    var p = points[i];
    if (i == 0) {
      controlPoints[i] = [];
      continue;
    }

    if (i == points.length - 1) {
      controlPoints[i] = [];
      continue;
    }

    var prevPoint = points[i - 1];
    var nextPoint = points[i + 1];

    // 기울기
    var M = (nextPoint[1] - prevPoint[1]) / (nextPoint[0] - prevPoint[0]);

    var newControlPoint = [
      prevPoint[0] + (nextPoint[0] - prevPoint[0]) * tension,
      prevPoint[1] + (nextPoint[1] - prevPoint[1]) * tension
    ];

    var controlPoint = [
      [...prevPoint] /* start */,
      [...newControlPoint] /* end */
    ];

    var P = Math.sqrt(
      Math.pow(p[0] - prevPoint[0], 2) + Math.pow(p[1] - prevPoint[1], 2)
    );
    var N = Math.sqrt(
      Math.pow(nextPoint[0] - p[0], 2) + Math.pow(nextPoint[1] - p[1], 2)
    );

    var rate = P / N;

    var dx =
      controlPoint[0][0] + (controlPoint[1][0] - controlPoint[0][0]) * rate;
    var dy =
      controlPoint[0][1] + (controlPoint[1][1] - controlPoint[0][1]) * rate;

    controlPoint[0][0] += p[0] - dx;
    controlPoint[0][1] += p[1] - dy;
    controlPoint[1][0] += p[0] - dx;
    controlPoint[1][1] += p[1] - dy;

    controlPoints[i] = controlPoint;
  }

  return controlPoints;
}

export function ImageToHistogram(
  url,
  callback,
  opt = { width: 200, height: 100 }
) {
  var img = new ImageLoader(url);
  img.loadImage(() => {
    Canvas.createHistogram(
      opt.width || 200,
      opt.height || 100,
      img.toHistogram(opt),
      function(canvas) {
        if (isFunction(callback)) callback(canvas.toDataURL("image/png"));
      },
      opt
    );
  });
}
