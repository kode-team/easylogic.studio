import { vec3 } from "gl-matrix";

import SingleSelectionTransformer from "./SingleSelectionTransformer";
import MultiSelectionTransformer from "./MultiSelectionTransformer";

export default class SelectionTransformer {

    /**
     * @param {Editor} editor
     */
    constructor(editor) {
        this.editor = editor;

        this.initializeCache();
    }

    initializeCache() {


        if (this.editor.selection.isOne) {
            this.transformer = new SingleSelectionTransformer(this.editor);
        } else if (this.editor.selection.isMany) {
            this.transformer = new MultiSelectionTransformer(this.editor);
        }
    }

    get groupItem() {
        if (this.transformer) {
            return this.transformer.groupItem;
        }
    }

    /**
     * distVector 만큼 이동한다. 
     * 
     * @param {vec3} distVector 
     * 
     * @returns {object} 
     * @returns {object.id} 
     */
    moveTo(distVector) {

        if (this.transformer) {
            return this.transformer.moveTo(distVector);
        }
    }

    refreshSmartGuides() {
        if (this.transformer) {
            return this.transformer.refreshSmartGuides();
        }
    }

    rotate (distVector, rotateTargetNumber, isShiftKey) {
        if (this.transformer) {
            return this.transformer.rotate(distVector, rotateTargetNumber, isShiftKey);
        }
    }

}