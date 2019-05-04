import blur from './blur'
import emboss from './emboss'
import gaussianBlur from './gaussian-blur'
import gaussianBlur5x from './gaussian-blur-5x'
import grayscale2 from './grayscale2'
import normal from './normal'
import kirschHorizontal from './kirsch-horizontal'
import kirschVertical from './kirsch-vertical'
import laplacian from './laplacian'
import laplacian5x from './laplacian-5x'
import motionBlur from './motion-blur'
import motionBlur2 from './motion-blur-2'
import motionBlur3 from './motion-blur-3'
import negative from './negative'
import sepia2 from './sepia2'
import sharpen from './sharpen'
import sobelHorizontal from './sobel-horizontal'
import sobelVertical from './sobel-vertical'
import stackBlur from './stack-blur'
import transparency from './transparency'
import unsharpMasking from './unsharp-masking'


export default {
     blur,
     emboss,
     gaussianBlur,
     'gaussian-blur': gaussianBlur,
     gaussianBlur5x,
     'gaussian-blur-5x': gaussianBlur5x,
     grayscale2,
     normal,
     kirschHorizontal,
     'kirsch-horizontal': kirschHorizontal,
     kirschVertical,
     'kirsch-vertical': kirschVertical,
     laplacian,
     laplacian5x,
     'laplacian-5x': laplacian5x,
     motionBlur,
     'motion-blur': motionBlur,
     motionBlur2,
     'motion-blur-2': motionBlur2,
     motionBlur3,
     'motion-blur-3': motionBlur3,
     negative,
     sepia2,
     sharpen,
     sobelHorizontal,
     'sobel-horizontal': sobelHorizontal,
     sobelVertical,
     'sobel-vertical': sobelVertical,
     stackBlur,
     'stack-blur': stackBlur,
     transparency,
     unsharpMasking,
     'unsharp-masking': unsharpMasking
}