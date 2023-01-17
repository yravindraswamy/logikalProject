const express = require("express");
const router  = express.Router();
const app = express();

const {open} = require("sqlite");
const sqlite3 = require("sqlite3");

const path = require("path");
const dbPath = path.join(__dirname,"logikal.db");

const xlsx = require("xlsx");
const { response } = require("express");
const { table } = require("console");
const { env } = require("process");
// const { response } = require("express");

// const { response } = require("express");
app.use(express.json());

//this is the line very impartant to show css styles to the html page
app.use(express.static(path.join(__dirname,"")))




let db = null;
const initalizeDBAndServer = async () =>{
    try{
        db = await open({
            filename:dbPath,
            driver:sqlite3.Database
        })
        app.listen(process.env.PORT || 5000,() =>{
            console.log('port:5000')
        })
    }catch(e){
        console.log(`connection Error at ${e.message}`);
    }
};
initalizeDBAndServer();

app.get('/',async(request,response)=>{
    const getData = `
    SELECT * FROM ASHOK;
    `;
    const dbResponse = await db.all(getData);
    response.send(dbResponse);
})

app.post('/storeData',async(request,response)=>{
    const tableDetailsAndTableContent = request.body;
    const{name,data} = tableDetailsAndTableContent;
    const columnNames = Object.keys(data[0]);

    let text = '?,';
    
    let columns = text.repeat(columnNames.length);
    columns = columns.substring(0,columns.length-1);
    const createTableQuery = `
        CREATE TABLE ${name}
        (
            ${Object.keys(data[0])}
        );
    `;
    console.log(createTableQuery);
    // console.log(name);
    // console.log(data);
    // response.send(createTableQuery);
    try{
        await db.run(createTableQuery);
        
    }catch(e){
        console.log(`Db Error ${e.message}`)
    }
    
    
});


app.post('/insert',(request,repsponse)=>{
    const {name,data} = request.body;
    let text = '?,'
    let columns = text.repeat(Object.keys(data[0]).length);
    console.log(columns);
    columns = columns.substring(0,columns.length-1);
    console.log(columns);
    const insertData = `
    INSERT INTO ${name}
    values (
        ${columns}
    );
    `;
    console.log(insertData);
    data.forEach( async element => {
        await db.run(insertData,Object.values(element));
    });

})

