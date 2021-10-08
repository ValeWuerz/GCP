const xlsxFile = require('read-excel-file/node');
const register = require('./register.json')


let payload = [];

let replenishment_start;
let replenishment_end;
let mode= "slide3";


xlsxFile('./data_modified.xlsx').then((rows) => {
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
let last_state;
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

   // console.log("LAST_STATE: "+last_state);

//fill pos1,pos2,pos3 with current payload


//Here check for specific machine/system and fill variable with content of payload f.e. var group = CYW
let pos1 = states[location]["current_state"][0]
let pos2 = states[location]["current_state"][1]
let pos3 = states[location]["current_state"][2]
let pos4 = states[location]["current_state"][3]

if (states[location]["mode"] == "slide3") {
let current_state = [pos1, pos2, pos3]
let compare = current_state.toString()
console.info(current_state);
    

if (pos1, pos2, pos3 != undefined){

    
    if (compare == "1,0,1" || compare== "1,1,0" || compare== "1,0,0" || compare =="0,1,0") {

    console.log("irregular state");
    
    //check for anomaly
    }
    else if(compare== "1,1,1"){

    
        if (last_state== "1,1,1") {
            console.log("Again 1,1,1");
            last_state="1,1,1"
        }
        //check if last state was also 1,1,1
        else if (last_state== "0,1,1"){
            console.log("State changed from partly empty to filled");
            last_state="1,1,1"
            states[location]["replenishment_end"] = payload[i]["time"]
            console.log("STATES:  "+states);

            rep_time(states, location);
        }
        //check if last state was 0,1,1
        else{
        last_state="1,1,1"
        }
    }
    //check for all slots filled

    else if(compare == "0,1,1") {
        if (last_state=="0,1,1") {
            console.log("Again 0,1,1");
            last_state="0,1,1"
        }
        //check if last state was also 0,1,1

        else if(last_state=="1,1,1"){
            console.log("slot is empty and therefore replenishment timer starts");
            states[location]["replenishment_start"] = payload[i]["time"]
            
            last_state = "0,1,1"
        }
        //check if slot has emptied

        else if(last_state=="0,0,1"){

        console.log("State changed from partly empty to partly filled");
            last_state="0,1,1"
            states[location]["replenishment_end"] = payload[i]["time"]

            rep_time(states, location);
        }
        else{
           
        }
    }
    else if(compare== "0,0,1") {

        if (last_state=="0,0,1") {
            console.log("again 0,0,1");
            last_state="0,0,1"
            
        }
        else if (last_state=="0,1,1") {
            console.log("An additional slot has become empty and the replenishment timer starts renewed");
            states[location]["replenishment_start"] = payload[i]["time"]
            
            last_state="0,0,1"
            
        }
        else if (last_state=="1,1,1") {
            console.log("state changed from 1,1,1 to 0,0,1 so the replenishment timer has to start again");
            last_state="0,0,1"
            states[location]["replenishment_start"] = payload[i]["time"]

            
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
else if (mode=="slide1") {
    
}
else if (mode=="slide2") {
    
}
else if (mode=="slide4") {
    
}
else if (mode=="bed1") {
    
}

//check for mode of the logistic system

}
//end of forloop
})
function rep_time(states, location){

    let difference= states[location]["replenishment_end"] - states[location]["replenishment_start"];
    console.log("It is finished and the replenishment time is: "+ difference);
}