const modules = import.meta.globEager("./shortcuts_list/*.js");

export default Object.values(modules).map((it) => it.default);
