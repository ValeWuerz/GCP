let current_state= [1, 1, undefined]

let number= calc_num(current_state)
console.log(number);
function calc_num(current_state) {
  let sum=0
  for (let i = 0; i < current_state.length; i++) {
      if (current_state[i]==undefined) {
          sum +=0
      }
      else{
          sum += current_state[i];

      }
  }
  return sum
  
}