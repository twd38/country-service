var sqlite3 = require('sqlite3').verbose();
var express = require('express');

const app = express();
const port = process.env.PORT || 3000;


var db = new sqlite3.Database('./database/countries.db');

db.run('CREATE TABLE IF NOT EXISTS emp(id TEXT, name TEXT, population TEXT, flag TEXT, map TEXT)');

app.get('/', (req,res) => {
  res.send("<h3> Hi there, this is a simple country server. Available endpoints are /countries/:id and /countries/?page=1&limit=20");
});

//get single country
app.get('/countries/:id', function(req,res){
  db.serialize(()=>{
    db.each('SELECT id, name, population, flag, map FROM emp WHERE id =?', [req.params.id], function(err,row){     
      if(err){
        res.send("Error encountered while displaying");
        return console.error(err.message);
      }
      res.send(row);
      console.log("Entry displayed successfully");
    });
  });
});

//get all countries
app.get('/countries', function(req,res){
  const page = req.query.page - 1 || 0
  const limit = req.query.limit || 10000

  db.serialize(()=>{
    db.all(`SELECT * FROM emp LIMIT ${limit} OFFSET ${page*limit}`, [req.params.id], function(err,rows){   
      rows.forEach(row => {
        if(err){
          res.send("Error encountered while displaying");
        }
      })
      res.send(rows);  
    });
  });
});

app.listen(port, () => {
  console.log(`Country Service listening on port ${port}`)
})