import AnipaExport from "./AnipaExport";

export default {
    generate (project, artboard, type = 'anipa' ) {
        switch(type) {
        case 'anipa': return new AnipaExport(project, artboard).generateCode();
        }

        return ''
    }
}