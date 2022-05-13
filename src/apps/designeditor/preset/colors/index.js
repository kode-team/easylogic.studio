const modules = import.meta.globEager("./colors_list/*.js");

export default Object.values(modules).map((it) => it.default);
