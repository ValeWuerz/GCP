
let current_state= [1,1,0]

console.log(calc_num(current_state));

function calc_num(current_state) {
    let sum=0
    for (let i = 0; i < current_state.length; i++) {
        sum += current_state[i];
    }
    return sum
    
}

