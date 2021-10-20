const register = require('./new_register.json')

let states=register
let location= states.findIndex(a=>a.channel == "IG8")

console.log(location);