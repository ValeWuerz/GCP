const XLSX = require('xlsx')


let data = [
    {name: "hallo", sex: "1,2,3"},
    {name: "tschüss", sex: "1,2,3"},
    {name: "ses", sex: ""}
  ]

  for (let index = 0; index < data.length; index++) {
    if (data[index]["sex"][0]==undefined) {
        data.splice(index, 1)
        console.log("removed");
    }
    
}


const ws = XLSX.utils.json_to_sheet(data)
const wb = XLSX.utils.book_new()
XLSX.utils.book_append_sheet(wb, ws, 'Responses')
XLSX.writeFile(wb, 'testing.export.xlsx')
