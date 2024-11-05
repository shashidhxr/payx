import mysql from 'mysql2'

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "bank_management"    
})

db.connect((err) => {
    if(err){
        console.log(err)
        return
    }
    console.log("db connected")
})

export default db