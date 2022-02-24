import baseEditor from "./base-editor"
import color from "./color"
import defaultMessages from "./default-messages"
import gradient from "./gradient"
import propertyEditor from "./property-editor"
import defaultIcons from "./default-icons"
import defaultConfigs from "./default-configs"

export default [
    defaultConfigs,
    defaultIcons,
    defaultMessages,

    // common editor 
    baseEditor,
    propertyEditor,
    color,
    gradient,

]