
const register = require('./register.json');

let state = register;
let location = state.findIndex(a=> a.channel=="CYW")
state[location]["pos1"]=1


