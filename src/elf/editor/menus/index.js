const modules = import.meta.globEager("./menu_list/*.js");

const obj = {};

Object.entries(modules).forEach(([key, value]) => {
  key = key.replace("./menu_list/", "").replace(".js", "");
  obj[key] = value.default;
});

export default obj;
