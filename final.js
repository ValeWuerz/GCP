const xlsxFile = require('read-excel-file/node');
 

let payload = [];
let pos1;
let pos2;
let pos3;
let replenishment_start;
let replenishment_end;
let mode= "slide3";
let status = []

xlsxFile('./data.xlsx').then((rows) => {
 console.table(rows);
 
 for (i in rows){
    for (j in rows[i]){
        payload[i] = {
            time: rows[i][0],
            position: rows[i][1],
            state: rows[i][2]

        }
    }
}
}).then(()=>{
//insert data from excel
let last_state;

for(var i=1;i<payload.length;i++){
   // console.log("LAST_STATE: "+last_state);
    if (payload[i]["position"]==='pos1'){
        pos1 = payload[i]["state"];
       }
       else if(payload[i]["position"]==="pos2"){
        pos2 = payload[i]["state"]; 
   
   }
       else if(payload[i]["position"]==="pos3"){
        pos3 = payload[i]["state"]; 
   
       }
       else if (payload[i]["position"]==="pos4") {
        pos4 = payload[i]["state"]; 
           
       }
       else{
           console.log("something went wrong");
       }
//fill pos1,pos2,pos3 with current payload


//Here check for specific machine/system and fill variable with content of payload f.e. var group = CYW
let current_state = [pos1, pos2, pos3];

console.info(current_state);
if (mode == "slide3") {
    

if (pos1, pos2, pos3 != undefined){

    let compare = current_state.toString()
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
            replenishment_end = payload[i]["time"]
            rep_time();
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
            replenishment_start = payload[i]["time"]
            last_state = "0,1,1"
        }
        //check if slot has emptied

        else if(last_state=="0,0,1"){

        console.log("State changed from partly empty to partly filled");
            last_state="0,1,1"
            replenishment_end = payload[i]["time"]
            rep_time();
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
            replenishment_start = payload[i]["time"]
            last_state="0,0,1"
            
        }
        else if (last_state=="1,1,1") {
            console.log("state changed from 1,1,1 to 0,0,1 so the replenishment timer has to start again");
            last_state="0,0,1"
            replenishment_start = payload[i]["time"]

            
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
function rep_time(){

    let difference= replenishment_end - replenishment_start;
    console.log("It is finished and the replenishment time is: "+ difference);
}