let payload = msg.payload[0];
let states=msg.payload[1]

let files= ['./11-14_comb.xlsx']
for (let index = 0; index < files.length; index++) {
    file_analysis(files[index])
}

function file_analysis(file) {
/* xlsxFile(file,{sheet: 'Sheet1'}).then((rows) => {
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
}).then(()=>{ */
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
let pos5 = states[location]["current_state"][4]
let pos6 = states[location]["current_state"][5]
let pos7 = states[location]["current_state"][6]
let pos8 = states[location]["current_state"][7]
let pos9 = states[location]["current_state"][8]
let pos10 = states[location]["current_state"][9]

if (states[location]["mode"] == "slide3") {
let current_state = [pos1, pos2, pos3]
let compare = current_state.toString()
let filled= calc_num(current_state)
let channel = states[location]["channel"]

console.log(channel+": "+current_state);
    

if (pos1, pos2, pos3 != undefined){

    
    if (compare == "1,0,1" || compare== "1,1,0" || compare== "1,0,0" || compare =="0,1,0") {

    console.log("irregular state");
    
    //check for anomaly
    }
    else if(compare== "1,1,1"){

    
        if (states[location]["last_state"]== "1,1,1") {
            states[location]["last_state"]="1,1,1"
        }
        //check if last state was also 1,1,1
        else if (states[location]["last_state"]== "0,1,1"){
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
            states[location]["last_state"]="0,1,1"
        }
        //check if last state was also 0,1,1

        else if(states[location]["last_state"]=="1,1,1"){
            consumption(states, location, time, day)
            if (filled==states[location]["min"]) {
                for (let index = 0; index < states[location]["max"]-filled; index++) {
                    states[location]["replenishment_start"].push(payload[i]["time"])

                        
                    }
            }
            else if (filled<states[location]["min"]) {
                    states[location]["replenishment_start"].push(payload[i]["time"])

            }
           
            
            states[location]["last_state"] = "0,1,1"
        }
        //check if slot has emptied

        else if(states[location]["last_state"]=="0,0,1"){

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
            states[location]["last_state"]="0,0,1"
            
        }
        else if (states[location]["last_state"]=="0,0,0") {

            states[location]["last_state"]="0,0,1"
                          
            //if condition when min_value is state value
            states[location]["replenishment_end"].push(payload[i]["time"])
            
            //rep_time(states, location);
        }
        else if (states[location]["last_state"]=="0,1,1") {
            consumption(states, location, time, day)

            if (filled==states[location]["min"]) {
                for (let index = 0; index < states[location]["max"]-filled; index++) {
                    states[location]["replenishment_start"].push(payload[i]["time"])
                    
                        
                    }
            }
            else if (filled<states[location]["min"]) {
                states[location]["replenishment_start"].push(payload[i]["time"])

        }
           
            
            states[location]["last_state"]="0,0,1"
            
        }
        else if (states[location]["last_state"]=="1,1,1") {
            states[location]["last_state"]="0,0,1"
            states[location]["replenishment_start"].push(payload[i]["time"])
            states[location]["replenishment_start"].push(payload[i]["time"])


            
        }



        //checken ob vorher states 0,0,1; 0,1,1 oder 1,1,1 war
    }
    else if(compare == "0,0,0") {
        if (states[location]["last_state"]=="0,0,0") {
            states[location]["last_state"]="0,0,0"
        }
        //check if last state was also 0,1,1

        else if(states[location]["last_state"]=="0,0,1"){
            consumption(states, location, time, day)

            if (filled==states[location]["min"]) {
                for (let index = 0; index < states[location]["max"]-filled; index++) {
                    states[location]["replenishment_start"].push(payload[i]["time"])

                        
                    }
            }
            else if (filled<states[location]["min"]) {
                    states[location]["replenishment_start"].push(payload[i]["time"])

            }
           
            
            states[location]["last_state"] = "0,0,0"
        }
        //check if slot has emptied

    }
    //end of switch statement
}

//happening if all 3 slots are defined

else{
}
}
else if (states[location]["mode"]=="slide1") {

let current_state = [pos1]
let compare = current_state.toString()
let filled= calc_num(current_state)
let channel = states[location]["channel"]

console.log(channel+": "+current_state);
    

if (pos1 != undefined){

    if (compare == "1") {
        if (last_state=="1") {
            states[location]["last_state"]="1"

        }
        else if (last_state=="0") {
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
        states[location]["last_state"]="0"  
    }
    else if(last_state=="1"){
        consumption(states, location, time, day)
            if (filled==states[location]["min"]) {
                for (let index = 0; index < states[location]["max"]-filled; index++) {
                    states[location]["replenishment_start"].push(payload[i]["time"])

                        
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
    
    console.log(channel+": "+current_state);
        
    
    if (pos1,pos2 != undefined){
        if (compare == "1,0" ) {

            console.log("irregular state");
            
            //check for anomaly
            }//irregular state
        else if (compare == "1,1") {
            if (last_state=="1,1") {
                states[location]["last_state"]="1,1"
    
            }
            else if (last_state=="0,1") {
                
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
            states[location]["last_state"]="0,1"  
        }
        else if(last_state=="1,1"){
            consumption(states, location, time, day)
                if (filled==states[location]["min"]) {
                    for (let index = 0; index < states[location]["max"]-filled; index++) {
                        states[location]["replenishment_start"].push(payload[i]["time"])
    
                            
                        }
                }
                states[location]["last_state"]="0,1"
    
        }
        else if (last_state=="0,0") {
                
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
                states[location]["last_state"]="0,0"

                
            }
            else if (last_state=="0,1") {
            consumption(states, location, time, day)
                if (filled==states[location]["min"]) {
                    for (let index = 0; index < states[location]["max"]-filled; index++) {
                        states[location]["replenishment_start"].push(payload[i]["time"])
    
                            
                        }
                }
                else if(filled<states[location]["min"]){
                states[location]["replenishment_start"].push(payload[i]["time"])


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
else if (states[location]["mode"]=="bodenroller1"||"bodenroller2"||"bodenroller3"||"bodenroller4"||"bodenroller5"||"bodenroller6"||"bodenroller7"||"bodenroller8"||"bodenroller9"||"bodenroller10") {
    let current_state = []
    
    let slots= states[location]["max"]
    for (let index = 0; index < slots; index++) {
        let counter= index+1
        current_state.push(eval(`pos`+counter))
       
        
    }
    if (states[location]["channel"]=="AWO") {
    }
    let compare = current_state.toString()
    let filled= calc_num(current_state)
    let channel = states[location]["channel"]
    let last_filled= calc_num(parseInt(states[location]["last_state"]))
        
    if (states[location]["last_state"]>filled) {
        consumption(states, location, time, day)

    }
    states[location]["last_state"]=filled
}

//check for mode of the logistic system

}

//end of forloop
/* }) */
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


    states[location]["rep_durations"].push(minutes_diff)
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
    
    states[location]["consumption_durations"].push(minutes_diff)
    
}
function consumption(states, location, time, day) {
    
    if (states[location]["consumption_start"][0]==undefined) {
        states[location]["consumption_start"].push(time)
        states[location]["con_startday"].push(day)
       
    
            }
    else{
        states[location]["consumption_start"].push(time)
        states[location]["con_startday"].push(day)

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
    return date
    }
//analysis_excel function
    function medianizise(data) {
        
const arrSort = data.sort();
let len=data.length
const mid = Math.ceil(len / 2);

const median =
  len % 2 == 0 ? (arrSort[mid] + arrSort[mid - 1]) / 2 : arrSort[mid - 1];
return median
        
    }
    function averaging(durations) {
        let length = durations.length
        let sum=0;
        let average;
        for (let index = 0; index < durations.length; index++) {
            sum= sum + durations[index]
        }

        average=sum/length
        return average
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
       
        //console.table(table)
         function analysis_excel(state) {
for (let index = 0; index < state.length; index++) {

    if (state[index]["consumption_end"][0]==undefined) {
        state.splice(index, 1)
        index=0


    }
   delete state[index]["replenishment_start"]
   delete state[index]["rep_durations"]
   delete state[index]["consumption_start"]
   delete state[index]["replenishment_end"]
   delete state[index]["con_endday"]
   delete state[index]["con_startday"]
   delete state[index]["rep_time_limit"]
   delete state[index]["current_state"]
   let average_duration=averaging(state[index]["consumption_durations"])
   let median_duration=medianizise(state[index]["consumption_durations"])
  state[index]["counter"]=state[index]["consumption_durations"].length

  state[index]["con_average"]=average_duration
  state[index]["con_median"]=median_duration
if (state[index]["consumption_end"]==undefined) {
    continue
    
}
else{
    for (let i = 0; i < state[index]["consumption_end"].length; i++) {
        state[index]["con_end"+i] = state[index]["consumption_end"][i]
        state[index]["con_durations"+i]= state[index]["consumption_durations"][i]
       
    }
}
   /* 
  delete state[index]["consumption_durations"]
  delete state[index]["consumption_end"]
 */
   
  
    
}
for (let index = 0; index < state.length; index++) {
    delete state[index]["consumption_end"]
    delete state[index]["consumption_durations"]
  
}
  

        
    }
    analysis_excel(states);    
    console.log(states)
        

      /*   const csv = new ObjectsToCsv(states)
        csv.toDisk('./array.csv') */


    }
return msg;