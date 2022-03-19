export const WorkbenchManager = new class {
  constructor(opt = {}) {
    this.workbenches = {} 
  }

  getWorkbench(workbenchName) {
    if (!this.workbenches[workbenchName]) {
      this.workbenches[workbenchName] = {}
    }

    return this.workbenches[workbenchName];
  }

  registerWorkbench (workbenchName, WorkbenchClassName) {

    const currentWorkbench = this.getWorkbench(workbenchName);

    if (currentWorkbench) throw new Error("It has duplicated renderer name. " + name);
    this.workbenches[workbenchName] = WorkbenchClassName;
  }
}();
