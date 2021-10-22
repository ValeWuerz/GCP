let arr= [1,5,4,2]

const arrSort = arr.sort();
let len=arr.length
const mid = Math.ceil(len / 2);

const median =
  len % 2 == 0 ? (arrSort[mid] + arrSort[mid - 1]) / 2 : arrSort[mid - 1];

console.log("median: ", median);