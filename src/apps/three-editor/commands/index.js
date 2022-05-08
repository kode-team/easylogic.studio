const modules = import.meta.globEager("./command_list/**/*.js");

const obj = {};

Object.entries(modules).forEach(([key, value]) => {
  key = key.replace("./command_list/", "").replace(".js", "");
  obj[key] = value.default;
});

export default obj;
