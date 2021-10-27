const fs = require('fs');
const xlsxFile = require('read-excel-file/node');

let payload=[]
let register=[]
xlsxFile('./11-14_comb.xlsx',{sheet: 'Sheet1'}).then((rows) => {
    console.table(rows);
    
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
        console.log(payload.length);
        console.log(payload[i]);
    let name=payload[i]["channel"]
    let mode= "slide"+ payload[i]["max"]

    let channel = {
        time: payload[i]["time"],
        position: payload[i]["position"],
        state: payload[i]["state"],
        channel: payload[i]["channel"],
        day: payload[i]["day"]

   }
register.push(channel)


   }
   let data = JSON.stringify(register);
   fs.writeFileSync('11-14_vfc.json', data);

})
