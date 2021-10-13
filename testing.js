let zeitsample1= '100629';
let zeitsample2= '075900'

 


let end = zeit(zeitsample1)
let start = zeit(zeitsample2)

let difference = end.getTime() - start.getTime()
let minutes = Math.floor(difference/1000/60)

console.log(minutes);

function zeit(timestring) {
    

let stunden = timestring[0] + timestring[1]
let minuten = timestring[2] + timestring[3]
let sekunden = timestring[4] + timestring[5]
let date = new Date(2021, 5, 17, stunden, minuten, sekunden)
console.log(date);
return date
}