export class PathKitManager {
  constructor(editor) {
    this.editor = editor;
    this.pathkit = null; 
  }

  registerPathKit (pathkit) {
    this.pathkit = pathkit;

    this.editor.emit("updatePathKit");
  }

  has() {
    return !!this.pathkit;
  }

  booleanOperation (first, second, pathOp) {
    const PathKit = this.pathkit;
    let firstPath = PathKit.FromSVGString(first);

    let secondPath = PathKit.FromSVGString(second);

    // Join the two paths together (mutating firstPath in the process)
    firstPath.op(secondPath, pathOp);

    return firstPath.toSVGString();
  }

  intersection(first, second) {
    const PathKit = this.pathkit;
    if (!PathKit) return;    
    return this.booleanOperation(first, second, PathKit.PathOp.INTERSECT);
  }

  union(first, second) {
    const PathKit = this.pathkit;
    if (!PathKit) return;    
    return this.booleanOperation(first, second, PathKit.PathOp.UNION);
  }

  difference(first, second) {
    const PathKit = this.pathkit;
    if (!PathKit) return;    
    return this.booleanOperation(first, second, PathKit.PathOp.DIFFERENCE);
  }

  xor(first, second) {
    const PathKit = this.pathkit;
    if (!PathKit) return;
    return this.booleanOperation(first, second, PathKit.PathOp.XOR);
  }

  isValidPath(path) {
    const PathKit = this.pathkit;

    let pathKitPath = PathKit.FromSVGString(path);

    return pathKitPath.isValid();
  }

};
