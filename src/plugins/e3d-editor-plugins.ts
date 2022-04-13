import baseEditor from "./base-editor"
import component from "./component"
import defaultConfigs from "./default-configs"
import defaultMessages from "./default-messages"

import layerTree from "./layer-tree"
import project from "./project"

import defaultIcons from "./default-icons"


export default [

    defaultConfigs,
    defaultIcons,
    defaultMessages,
    // defaultItems,
    // defaultPatterns,

    // rendererHtml,
    // rendererJson,
    // rendererSvg,

    // common editor 

    baseEditor,
    // propertyEditor,
        
    // color,
    // gradient,
    

    // inspector.tab.style    
    
    // depth,
    // alignment,
    // position,    
    // layout,   
    


    // layout 
    // boxModel,
    // pathTool,         
    // artboard,  
    
    // text
    // svgText,
    // font,
    // text,
    // textShadow,
    // content,
    
    // appearance,
    // iframe,
    component,
    // backgroundImage,
    // patternAsset,    
    // // border 
    // border,
    // borderRadius,


    // resource        

    layerTree,

    // todo: timeline,
    //timeline
    project,
]