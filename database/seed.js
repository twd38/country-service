let fs = require('fs');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./countries.db');


let file = fs.readFileSync('./countries.json', 'utf8');

let countryData = JSON.parse(file)
console.log(countryData[0])


db.run('CREATE TABLE IF NOT EXISTS emp(id TEXT, name TEXT, population TEXT, flag TEXT, map TEXT)');

let id = 0
for(let country of countryData){
  db.serialize(()=>{
    db.run('INSERT INTO emp(id,name,population,flag,map) VALUES(?,?,?,?,?)', [id, country.name.official, country.population, country.flags.png, country.maps.googleMaps], function(err) {
      if (err) {
        return console.log(err.message);
      }
      console.log("New country has been added");
    });
  });
  id++
}