const modules = import.meta.globEager('./icon_list/*.js')

const obj = {}

Object.entries(modules).forEach(([key, value]) => {
    key = key.replace('./icon_list/', '').replace('.js', '') 
    obj[key] = value.default
})

export default obj;