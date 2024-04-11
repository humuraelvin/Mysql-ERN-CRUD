const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.use(express.json());


const port = 5000;

const dbconn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "employees"
})

dbconn.connect((err) => {
    if (err) {
        console.log("Error connecting to Mysql database" + err.stack);
    }
    console.log("Connected to Mysql database successfully");
})


app.post('/add_user', (req, res) => {
    sql = "INSERT INTO employee (`names`,`email`,`phone`,`gender`) VALUES (?, ?, ?, ?)";
    const values = [
        req.body.name,
        req.body.email,
        req.body.phone,
        req.body.gender
    ]

    dbconn.query(sql, values, (err, result) => {
        if (err)
            return res.status(500).json({ message: "Internal server error" + err })
        return res.json({ sucess: "Employee recruited and saved successfully" })
    })

})

app.get('/employees', (req, res) => {
    const sql = "SELECT * FROM employee";
    dbconn.query(sql, (err, result) => {
        if (err)
            res.status(500).json({ message: "Internal server error" })
        return res.status(200).json(result)
    })
})

app.get('/get_employee/:id', (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM employee WHERE `id` = ?";
    dbconn.query(sql,[id], (err, result) => {
        if (err)
            res.status(500).json({ message: "Internal server error" })
        return res.status(200).json(result)
    })
})

app.put('/edit_user/:id', (req, res) => {
    const id = req.params.id
    sql = "UPDATE employee SET `names`=?, `email`=?, `phone`=?, `gender`=? WHERE id = ?";
    const values = [
        req.body.names,
        req.body.email,
        req.body.phone,
        req.body.gender,
        id
    ]

    dbconn.query(sql, values, (err, result) => {
        if (err)
            return res.status(500).json({ message: "Internal server error" + err })
        return res.json({ sucess: "Employee data updated successfully" })
    })

})

app.delete('/delete_user/:id', (req, res) => {
    const id = req.params.id
    sql = "DELETE FROM employee WHERE id = ?";
    const values = [
        id
    ]

    dbconn.query(sql, values, (err, result) => {
        if (err)
            return res.status(500).json({ message: "Internal server error" + err })
        return res.json({ sucess: "Employee deleted successfully" })
    })

})



app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})

