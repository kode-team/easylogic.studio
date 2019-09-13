import AnipaExport from "./AnipaExport";

export default {
    generate (artboard, type = 'anipa' ) {
        switch(type) {
        case 'anipa': return new AnipaExport(artboard).generateCode();
        }

        return ''
    }
}