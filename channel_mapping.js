const fs = require('fs');
const xlsxFile = require('read-excel-file/node');

let payload=[]
let register=[]
xlsxFile('./test.xlsx',{sheet: 'Sheet1'}).then((rows) => {
    console.table(rows);
    
    for (i in rows){
       for (j in rows[i]){
           payload[i] = {
             
               channel: rows[i][8],
               max: rows[i][6]
   
           }
       }
   }
   }).then(()=>{

    for(var i=1;i<payload.length;i++){
        console.log(payload.length);
        console.log(payload[i]);
    let name=payload[i]["channel"]
    let mode= "slide"+ payload[i]["max"]

    let channel = {
    "channel": name,
    "mode": mode,
    "max" : payload[i]["max"],
    "min" : 1,
    "rep_time_limit": 360,
    
    "current_state":[],
    "last_state":[],
    "replenishment_start": [],
    "replenishment_end": [],
    "rep_durations": [],

    "consumption_start":[],
    "consumption_end":[],
    "consumption_durations": []
   }
register.push(channel)


   }
   let data = JSON.stringify(register);
   fs.writeFileSync('new_register.json', data);

})
