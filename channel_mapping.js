const fs = require('fs');
const xlsxFile = require('read-excel-file/node');

let payload=[]
let register=[]
xlsxFile('./SampleDataGCP/PDM_OWNER_AD_Z2L3VKK.xlsx',{sheet: 'PDM_OWNER_AD_Z2L3VKK'}).then((rows) => {
    console.table(rows);
    
    for (i in rows){
       for (j in rows[i]){
           payload[i] = {
             
               channel: rows[i][8],
               max: rows[i][6],
               max_roll: rows[i][7]
   
           }
       }
   }
   }).then(()=>{

    for(var i=1;i<payload.length;i++){
        console.log(payload.length);
        console.log(payload[i]);
    let name=payload[i]["channel"]
    let mode= "slide"+ payload[i]["max"]
    let max = payload[i]["max"]
if (max==0) {
    mode="bodenroller"+payload[i]["max_roll"];
    max=payload[i]["max_roll"]
    
}
    let channel = {
    "channel": name,
    "mode": mode,
    "max" : max,
    "min" : 1,
    "rep_time_limit": 360,
    
    "current_state":[],
    "last_state":[],
    "replenishment_start": [],
    "replenishment_end": [],
    "rep_durations": [],

    "consumption_start":[],
    "consumption_end":[],
    "con_endday":[],
    "con_startday":[],

    "consumption_durations": []
   }
register.push(channel)


   }
   let data = JSON.stringify(register);
   fs.writeFileSync('new_register.json', data);

})
