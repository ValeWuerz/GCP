
const fs = require('fs');
const xlsxFile = require('read-excel-file/node');


let day= ""
let payload=[]
let register=[]

function zeit(timestring, day) {
    

  let stunden = timestring[0] + timestring[1]
  let minuten = timestring[2] + timestring[3]
  let sekunden = timestring[4] + timestring[5]
  let date = new Date(2021, 5, day, stunden, minuten, sekunden)
  console.log(date);
  return date
  }

  xlsxFile('./11-14_comb.xlsx',{sheet: 'Sheet1'}).then((rows) => {
    
    for (i in rows){
       for (j in rows[i]){
           payload[i] = {
             
            time: rows[i][2],
            position: rows[i][5],
            state: rows[i][6],
            channel: rows[i][3],
            day: rows[i][1]
   
           }
       }
   }
   }).then(()=>{
    
   
   for(var i=1;i<payload.length;i++){
  let exakt_time= maketime(payload, i)
let chan= payload[i]["channel"]
let position=payload[i]["position"]
  if (chan=="HO3") {
    let channel = {
   
    
      _time: exakt_time
  
  }
  channel["position"+position]=payload[i]["state"]
  register.push(channel)
  console.log(channel);
  
  }

}
let data = JSON.stringify(register);
fs.writeFileSync('Channels_JSON/HO3.json', data);

})
function maketime(payload, i) {
  let day=payload[i]["day"]
 let time= payload[i]["time"]
  let tag= day.getDate()
  let monat=day.getMonth()
  let jahr=day.getFullYear() 
  let stunde= time.substring(0,2)
  let minute= time.substring(2,4)
  let sekunde=time.substring(4,6)
  let datum= new Date(jahr, monat, tag, stunde,minute,sekunde)
   
  return datum
}
 