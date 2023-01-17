const myFormEl = document.getElementById("myForm");
const fileEl = document.getElementById("file");
let data;

function getDataFromFile() {
    data = fileEl.files[0]
    console.log(data)
}
myFormEl.addEventListener('submit',(event)=>{
    event.preventDefault()
    getDataFromFile()
})