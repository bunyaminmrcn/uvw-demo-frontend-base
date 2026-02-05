const pack = require('./package.json')
const deps = pack.dependencies

const depsKeys = Object.keys(deps)
console.log(depsKeys.join(" "))
