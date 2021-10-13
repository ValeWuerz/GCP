const xlsxFile = require('read-excel-file/node');
const register = require('./register.json')


let payload = [];

let replenishment_start;
let replenishment_end;
let mode= "slide3";


xlsxFile('./test_cases.xlsx',{sheet: 'Normal'}).then((rows) => {
 console.table(rows);
 
 for (i in rows){
    for (j in rows[i]){
        payload[i] = {
            time: rows[i][1],
            position: rows[i][3],
            state: rows[i][4],
            channel: rows[i][2]

        }
    }
}
}).then(()=>{
//insert data from excel
let states=register
for(var i=1;i<payload.length;i++){
    let chan= payload[i]["channel"]
    let location= states.findIndex(a=>a.channel == chan)
    

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

console.info(current_state);
    

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
            let len=states[location]["replenishment_end"].length
            
            rep_time(states, location, len);
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
            if (filled=states[location]["min"]) {
                for (let index = 0; index < filled; index++) {
                    states[location]["replenishment_start"].push(payload[i]["time"])
                        
                    }
            }
            else if (filled<states[location]["min"]) {
                    states[location]["replenishment_start"].push(payload[i]["time"])
            }
           
            console.log("slot is empty and therefore replenishment timer starts " + filled + "times");
            
            states[location]["last_state"] = "0,1,1"
        }
        //check if slot has emptied

        else if(states[location]["last_state"]=="0,0,1"){

        console.log("State changed from partly empty to partly filled");
            states[location]["last_state"]="0,1,1"
            states[location]["replenishment_end"].push(payload[i]["time"])
            let len=states[location]["replenishment_end"].length

            rep_time(states, location,len);
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
        else if (states[location]["last_state"]=="0,1,1") {
            console.log("An additional slot has become empty and the replenishment timer starts renewed");
            if (filled=states[location]["min"]) {
                for (let index = 0; index < filled; index++) {
                    states[location]["replenishment_start"].push(payload[i]["time"])
                        
                    }
            }
            else if (filled<states[location]["min"]) {
                states[location]["replenishment_start"].push(payload[i]["time"])
        }
           
            console.log("slot is empty and therefore replenishment timer starts " + filled + "times");
            
            states[location]["last_state"]="0,0,1"
            
        }
        else if (states[location]["last_state"]=="1,1,1") {
            console.log("state changed from 1,1,1 to 0,0,1 so the replenishment timer has to start again");
            states[location]["last_state"]="0,0,1"
            states[location]["replenishment_start"].push(payload[i]["time"])
            states[location]["replenishment_start"].push(payload[i]["time"])

            
        }



        //checken ob vorher states 0,0,1; 0,1,1 oder 1,1,1 war
    }
    //end of switch statement
}

//happening if all 3 slots are defined

else{
    console.log("there are undefined slots");
}
}
else if (states[location]["mode"]=="slide1") {
    
}
else if (states[location]["mode"]=="slide2") {
    let current_state = [pos1, pos2]
    let compare = current_state.toString()
    console.info(current_state);
}
else if (states[location]["mode"]=="slide4") {
    
}
else if (states[location]["mode"]=="bed1") {
    
}

//check for mode of the logistic system

}
//end of forloop
})
function rep_time(states, location, len){
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
    //implementieren, dass einträge in rep_start und rep_end an Position pos_calc gelöscht werden, wenn die differenz ausgerechnet wurde
}
function calc_num(current_state) {
    let sum=0
    for (let i = 0; i < current_state.length; i++) {
        sum += current_state[i];
    }
    return sum
    
}
function zeit(timestring) {
    

    let stunden = timestring[0] + timestring[1]
    let minuten = timestring[2] + timestring[3]
    let sekunden = timestring[4] + timestring[5]
    let date = new Date(2021, 5, 17, stunden, minuten, sekunden)
    console.log(date);
    return date
    }