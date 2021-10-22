const xlsxFile = require('read-excel-file/node');
const register = require('./new_register.json')
const XLSX = require('xlsx')

const ObjectsToCsv = require('objects-to-csv')

let payload = [];

let replenishment_start;
let replenishment_end;
let mode= "slide3";
let states=register

let files= ['./11-14_comb.xlsx']
for (let index = 0; index < files.length; index++) {
    file_analysis(files[index])
}

function file_analysis(file) {
xlsxFile(file,{sheet: 'Sheet1'}).then((rows) => {
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
//insert data from excel
for(var i=1;i<payload.length+1;i++){
    if (i == payload.length) {
        console.log("AUSWERTUNG:");
        auswertung(states);
        break
    }
    let chan= payload[i]["channel"]
    let location= states.findIndex(a=>a.channel == chan)
    if (location==-1) {
        continue;
        
    }
    let time = payload[i]["time"]
    let day = payload[i]["day"]
    console.log("TAG: "+day);
    let last_state = states[location]["last_state"]
    let replenishment_end= states[location]["replenishment_end"]
    let replenishment_start= states[location]["replenishment_start"]

        if (payload[i]["position"]==1){
            states[location]["current_state"][0] = payload[i]["state"];
           }
           else if(payload[i]["position"]==2){
            states[location]["current_state"][1] = payload[i]["state"]; 
       
       }
           else if(payload[i]["position"]==3){
            states[location]["current_state"][2] = payload[i]["state"]; 
       
           }
           else if (payload[i]["position"]===4) {
            states[location]["current_state"][3] = payload[i]["state"]; 
               
           }
           else{
               console.log("something went wrong");
           }
    

//If there is no channel to be located in states with this name (finder=-1)  => create one

   // console.log("LAST_STATE: "+states[location]["last_state"]);

//fill pos1,pos2,pos3 with current payload


//Here check for specific machine/system and fill variable with content of payload f.e. var group = CYW
let pos1 = states[location]["current_state"][0]
let pos2 = states[location]["current_state"][1]
let pos3 = states[location]["current_state"][2]
let pos4 = states[location]["current_state"][3]

if (states[location]["mode"] == "slide3") {
let current_state = [pos1, pos2, pos3]
let compare = current_state.toString()
let filled= calc_num(current_state)
let channel = states[location]["channel"]

console.info(channel+": "+current_state);
    

if (pos1, pos2, pos3 != undefined){

    
    if (compare == "1,0,1" || compare== "1,1,0" || compare== "1,0,0" || compare =="0,1,0") {

    console.log("irregular state");
    
    //check for anomaly
    }
    else if(compare== "1,1,1"){

    
        if (states[location]["last_state"]== "1,1,1") {
            console.log("Again 1,1,1");
            states[location]["last_state"]="1,1,1"
        }
        //check if last state was also 1,1,1
        else if (states[location]["last_state"]== "0,1,1"){
            console.log("State changed from partly empty to filled");
            states[location]["last_state"]="1,1,1"
                          
            //if condition when min_value is state value
            states[location]["replenishment_end"].push(payload[i]["time"])
            
            //rep_time(states, location);
        }
        //check if last state was 0,1,1
        else{
        states[location]["last_state"]="1,1,1"
        }
        //include logic for if last state was 001!
    }
    //check for all slots filled

    else if(compare == "0,1,1") {
        if (states[location]["last_state"]=="0,1,1") {
            console.log("Again 0,1,1");
            states[location]["last_state"]="0,1,1"
        }
        //check if last state was also 0,1,1

        else if(states[location]["last_state"]=="1,1,1"){
            consumption(states, location, time, day)
            if (filled==states[location]["min"]) {
                for (let index = 0; index < states[location]["max"]-filled; index++) {
                    console.log("INDEX: "+index);
                    states[location]["replenishment_start"].push(payload[i]["time"])
                    console.log("STARTED TIMER");

                        
                    }
            }
            else if (filled<states[location]["min"]) {
                    states[location]["replenishment_start"].push(payload[i]["time"])
                    console.log("STARTED TIMER");

            }
           
            
            states[location]["last_state"] = "0,1,1"
        }
        //check if slot has emptied

        else if(states[location]["last_state"]=="0,0,1"){

        console.log("State changed from partly empty to partly filled");
            states[location]["last_state"]="0,1,1"
            states[location]["replenishment_end"].push(payload[i]["time"])
            let len=states[location]["replenishment_end"].length

            //rep_time(states, location,len);
        }
        else{
        states[location]["last_state"]="0,1,1"
           
        }
    }
    else if(compare== "0,0,1") {

        if (states[location]["last_state"]=="0,0,1") {
            console.log("again 0,0,1");
            states[location]["last_state"]="0,0,1"
            
        }
        else if (states[location]["last_state"]=="0,0,0") {

             console.log("State changed from partly empty to  partly filled");
            states[location]["last_state"]="0,0,1"
                          
            //if condition when min_value is state value
            states[location]["replenishment_end"].push(payload[i]["time"])
            
            //rep_time(states, location);
        }
        else if (states[location]["last_state"]=="0,1,1") {
            console.log("An additional slot has become empty and the replenishment timer starts renewed");
            consumption(states, location, time, day)

            if (filled==states[location]["min"]) {
                for (let index = 0; index < states[location]["max"]-filled; index++) {
                    states[location]["replenishment_start"].push(payload[i]["time"])
                    console.log("STARTED TIMER");
                    
                        
                    }
            }
            else if (filled<states[location]["min"]) {
                states[location]["replenishment_start"].push(payload[i]["time"])
                console.log("STARTED TIMER");

        }
           
            
            states[location]["last_state"]="0,0,1"
            
        }
        else if (states[location]["last_state"]=="1,1,1") {
            console.log("state changed from 1,1,1 to 0,0,1 so the replenishment timer has to start again");
            states[location]["last_state"]="0,0,1"
            states[location]["replenishment_start"].push(payload[i]["time"])
            states[location]["replenishment_start"].push(payload[i]["time"])
            console.log("STARTED TIMER");
            console.log("STARTED TIMER");


            
        }



        //checken ob vorher states 0,0,1; 0,1,1 oder 1,1,1 war
    }
    else if(compare == "0,0,0") {
        if (states[location]["last_state"]=="0,0,0") {
            console.log("Again 0,0,0");
            states[location]["last_state"]="0,0,0"
        }
        //check if last state was also 0,1,1

        else if(states[location]["last_state"]=="0,0,1"){
            consumption(states, location, time, day)

            if (filled==states[location]["min"]) {
                for (let index = 0; index < states[location]["max"]-filled; index++) {
                    console.log("INDEX: "+index);
                    states[location]["replenishment_start"].push(payload[i]["time"])
                    console.log("STARTED TIMER");

                        
                    }
            }
            else if (filled<states[location]["min"]) {
                    states[location]["replenishment_start"].push(payload[i]["time"])
                    console.log("STARTED TIMER");

            }
           
            
            states[location]["last_state"] = "0,0,0"
        }
        //check if slot has emptied

    }
    //end of switch statement
}

//happening if all 3 slots are defined

else{
    console.log("there are undefined slots");
}
}
else if (states[location]["mode"]=="slide1") {

let current_state = [pos1]
let compare = current_state.toString()
let filled= calc_num(current_state)
let channel = states[location]["channel"]

console.info(channel+": "+current_state);
    

if (pos1 != undefined){

    if (compare == "1") {
        if (last_state=="1") {
            console.log("again 1");
            states[location]["last_state"]="1"

        }
        else if (last_state=="0") {
            console.log("empty slot is filled and rep_timer stopped");
            last_state="1"
            states[location]["last_state"]="1"
                          
            //if condition when min_value is state value
            states[location]["replenishment_end"].push(time)
            
            //rep_time(states, location);
        }
        else{
            states[location]["last_state"]="1"

        }
    }
else if (compare == "0") {
    if (last_state=="0") {
        console.log("again 0");
        states[location]["last_state"]="0"  
    }
    else if(last_state=="1"){
        console.log("the slot got empty and replenishment-timer starts if this is the minimum");
        consumption(states, location, time, day)
            if (filled==states[location]["min"]) {
                for (let index = 0; index < states[location]["max"]-filled; index++) {
                    console.log("INDEX: "+index);
                    states[location]["replenishment_start"].push(payload[i]["time"])
                    console.log("STARTED TIMER");

                        
                    }
            }
            states[location]["last_state"]="0"

    }
}
  
}
}
else if (states[location]["mode"]=="slide2") {
    let current_state = [pos1, pos2]
    let compare = current_state.toString()
    let filled= calc_num(current_state)
    let channel = states[location]["channel"]
    
    console.info(channel+": "+current_state);
        
    
    if (pos1,pos2 != undefined){
        if (compare == "1,0" ) {

            console.log("irregular state");
            
            //check for anomaly
            }//irregular state
        else if (compare == "1,1") {
            if (last_state=="1,1") {
                console.log("again 1,1");
                states[location]["last_state"]="1,1"
    
            }
            else if (last_state=="0,1") {
                console.log("empty slot is filled and rep_timer stopped");
                
                states[location]["last_state"]="1,1"
                              
                //if condition when min_value is state value
                states[location]["replenishment_end"].push(time)
                
                //rep_time(states, location);
            }
            else{
                states[location]["last_state"]="1,1"
    
            }
        }
        else if (compare == "0,1") {
        if (last_state=="0,1") {
            console.log("again 0,1");
            states[location]["last_state"]="0,1"  
        }
        else if(last_state=="1,1"){
            console.log("the slot got empty and replenishment-timer starts if this is the minimum");
            consumption(states, location, time, day)
                if (filled==states[location]["min"]) {
                    for (let index = 0; index < states[location]["max"]-filled; index++) {
                        console.log("INDEX: "+index);
                        states[location]["replenishment_start"].push(payload[i]["time"])
                        console.log("STARTED TIMER");
    
                            
                        }
                }
                states[location]["last_state"]="0,1"
    
        }
        else if (last_state=="0,0") {
            console.log("empty slot is filled and rep_timer stopped");
                
                states[location]["last_state"]="0,1"
                              
                //if condition when min_value is state value
                states[location]["replenishment_end"].push(time)
                
                //rep_time(states, location);
            
        }
        else{
            states[location]["last_state"]="0,1"

        }
    }
        else if(compare == "0,0"){
            if (last_state=="0,0") {
                console.log("again 0,0");
                states[location]["last_state"]="0,0"

                
            }
            else if (last_state=="0,1") {
                console.log("the slot got empty and replenishment-timer starts if this is the minimum");
            consumption(states, location, time, day)
                if (filled==states[location]["min"]) {
                    for (let index = 0; index < states[location]["max"]-filled; index++) {
                        console.log("INDEX: "+index);
                        states[location]["replenishment_start"].push(payload[i]["time"])
                        console.log("STARTED TIMER");
    
                            
                        }
                }
                else if(filled<states[location]["min"]){
                states[location]["replenishment_start"].push(payload[i]["time"])
                console.log("STARTED TIMER");


                }
                states[location]["last_state"]="0,0"
                
            }
            else{
                states[location]["last_state"]="0,0"

            }

    }
   
    }
}
else if (states[location]["mode"]=="slide4") {
    
}
else if (states[location]["mode"]=="bed1") {
    
}

//check for mode of the logistic system

}

//end of forloop
})
}
function rep_time(states, location){

    let len=states[location]["replenishment_end"].length

    let pos_calc=len-1

    let end = states[location]["replenishment_end"][pos_calc]
    let start = states[location]["replenishment_start"][pos_calc]

    let endTime = zeit(end)
    let startTime = zeit(start)

    let difference = endTime.getTime() - startTime.getTime()
    let minutes_diff = Math.floor(difference/1000/60)

    console.log("END: " + end);
    console.log("START: " + start);
    console.log("TIMEDIFFERENCE IN Minutes: "+minutes_diff);

    states[location]["rep_durations"].push(minutes_diff)
    console.log("DURATION: "+states[location]["rep_durations"]);
    console.log("LAST_STATE: "+states[location]["last_state"]);
    console.log("REP_END: "+states[location]["replenishment_end"]);
    console.log("REP_START: "+states[location]["replenishment_start"]);
    //implementieren, dass einträge in rep_start und rep_end an Position pos_calc gelöscht werden, wenn die differenz ausgerechnet wurde
}
function consumption_time(states, location) {

    let len=states[location]["consumption_end"].length
    let pos_calc=len-1
    
    let end = states[location]["consumption_end"][pos_calc]
    let start = states[location]["consumption_start"][pos_calc]
    let con_endday=states[location]["con_endday"][pos_calc]
    let con_startday=states[location]["con_startday"][pos_calc]

    let endTime = zeit(end, con_endday)
    
    let startTime = zeit(start, con_startday)

    let difference = endTime.getTime() - startTime.getTime()
    let minutes_diff = Math.floor(difference/1000/60)
    console.log("CONSUMPTION END: "+end);
    console.log("CONSUMPTION START: "+start);
    console.log("TIMEDIFFERENCE IN Minutes: "+minutes_diff);
    
    states[location]["consumption_durations"].push(minutes_diff)
    
}
function consumption(states, location, time, day) {
    if (states[location]["consumption_start"][0]==undefined) {
        console.log("FIRST CONSUMPTION");
        states[location]["consumption_start"].push(time)
        states[location]["con_startday"].push(day)

            }
    else{
        states[location]["consumption_start"].push(time)
        states[location]["con_startday"].push(day)

        console.log("CONSUMPTION START");
        console.log("CONSUMPTION END");
        states[location]["consumption_end"].push(time)
        states[location]["con_endday"].push(day)
        consumption_time(states, location)

    }
    
}
function calc_num(current_state) {
    let sum=0
    for (let i = 0; i < current_state.length; i++) {
        sum += current_state[i];
    }
    return sum
    
}
function zeit(timestring, day) {
    

    let stunden = timestring[0] + timestring[1]
    let minuten = timestring[2] + timestring[3]
    let sekunden = timestring[4] + timestring[5]
    let date = new Date(2021, 5, day, stunden, minuten, sekunden)
    console.log(date);
    return date
    }
 function analysis_excel(state) {
for (let index = 0; index < state.length; index++) {

    if (state[index]["consumption_end"][0]==undefined) {
        state.splice(index, 1)
        index=0

        console.log("removed");

    }
   delete state[index]["replenishment_start"]
   delete state[index]["rep_durations"]
   delete state[index]["consumption_start"]
   delete state[index]["replenishment_end"]
   delete state[index]["con_endday"]
   delete state[index]["con_startday"]
   delete state[index]["rep_time_limit"]
   delete state[index]["current_state"]
  // let average_duration=averaging(state[index]["consumption_durations"])
   //state[index]["con_average"]=average_duration
/* if (state[index]["consumption_end"]==undefined) {
    continue
    
}
else{
    for (let i = 0; i < state[index]["consumption_end"].length; i++) {
        state[index]["con_end"+i] = state[index]["consumption_end"][i]
        state[index]["con_durations"+i]= state[index]["consumption_durations"][i]
       
    }
} */
   /* 
  delete state[index]["consumption_durations"]
  delete state[index]["consumption_end"]
 */
   
  
    
}

    const ws = XLSX.utils.json_to_sheet(state)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Responses')
    XLSX.writeFile(wb, 'sampleData.export.xlsx')
    

        
    }
    function averaging(durations) {
        let length = durations.length
        let sum;
        let average;
        for (let index = 0; index < durations.length; index++) {
            sum + durations[index]
        }
        average=sum/length
        
    }
    function auswertung(stat) {

        let table=[]
        states.forEach(element => {
            let timelimit= element["rep_time_limit"]
            let durations=element["rep_durations"]
            let durations_hour=[]
            let consumption_durations=element["consumption_durations"]
            let consumption_hour=[]
            for (let index = 0; index < durations.length; index++) {
                let tosplit_rep= durations[index]/60
                let splitted_rep = tosplit_rep.toString().split('.')
                let minutes_rep = splitted_rep[1]*60
                durations_hour[index]=splitted_rep[0] + ':' + minutes_rep.toString().slice(0,2)
            }
            for (let index = 0; index < consumption_durations.length; index++) {
                let tosplit_con= consumption_durations[index]/60
                let splitted_con = tosplit_con.toString().split('.')
                let minutes_con = ('0.'+splitted_con[1])*60
                let final_minutes = minutes_con * 10
                consumption_hour[index]=splitted_con[0]+':' + final_minutes.toString().slice(0,2)
                console.log(consumption_hour);
            }
            let exceeded=0
            let in_time=0
            
            durations.forEach(element =>{
                if (element>timelimit) {
                    exceeded=exceeded+1;

                    
                }
                else if (element<timelimit) {
                    in_time=in_time+1
                    
                }

            })
          
            function CHANNEL(channel, reptimes, exceeded, in_time, con_minutes) {
                this.channel = channel
                this.reptimes = reptimes
                this.exceeded = exceeded
                this.in_time= in_time
                this.conminutes=con_minutes
                
            }
        
           let eintrag = new CHANNEL(element["channel"], durations_hour, exceeded,in_time,  consumption_durations)
          table.push(eintrag)
            

        });
        console.table(table)

analysis_excel(states);     
        

      /*   const csv = new ObjectsToCsv(states)
        csv.toDisk('./array.csv') */


    }