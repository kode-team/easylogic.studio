const modules = import.meta.globEager("./config_list/*.js");

export default Object.values(modules).map((it) => it.default);
