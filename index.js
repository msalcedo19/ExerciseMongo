
const MongoClient = require("mongodb").MongoClient;
const express = require("express");
const app = express();
var conn = MongoClient.connect("mongodb://localhost:27017", {useNewUrlParser: true, useUnifiedTopology: true});


function getCountries(cllBack)
{
    conn.then(client => {
        client.db("dbWeb1").collection("paises").find({}).toArray((err, data)=> {
            cllBack(data);
        })
    });
}

function getCountryId(cllBack, pais)
{
    conn.then(client => {
        client.db("dbWeb1").collection("paises").find( {country: pais} ).toArray((err, data)=> {
            console.log(client.db("dbWeb1").collection("paises").find( {country: pais} ));
            cllBack(data);
        })
    });
}

function postCountry(cllBack, dataPost)
{
    conn.then(client => {
       client.db("dbWeb1").collection("paises").insertOne(dataPost, (err, data) => {
           if (err !=null) {
               console.log("Hubo un error Creando el elemento: " + err);
           }
           else {
               cllBack(data);
           }
       });
    });
}

function deleteCountry(cllBack, pais)
{
    conn.then(client => {
        client.db("dbWeb1").collection("paises").deleteOne({"country": pais}, (err, data) => {
            if(err != null) {
                console.log("Hubo un error Borrando el elemento: " + err);
            }
            else {
                cllBack({"mensaje": "Se elimino la información relacionada con el pais: " + pais})
            }
        });
    });
}

function putCountry(cllBack, pais, dataPut)
{
    conn.then(client => {
        client.db("dbWeb1").collection("paises").updateOne({"country": pais}, {$set: dataPut}, (err, data) => {
            if(err != null) {
                console.log("Hubo un error Creando el elemento: " + err);
            }
            else {
                cllBack(data)
            }
        });
    });
}



app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.get("/countries", (req, res) => {
    getCountries(data => {
       res.json(data);
    });
});

app.get("/countries/:pais", (req, res) => {
    let pais = req.params.pais;
    getCountryId(data => {
        res.json(data);
    }, pais);
});

app.post("/countries", (req, res) => {
    let dataPost = req.body;
    if (dataPost != null)
    {
        postCountry( data => {
            res.json(data.ops[0]);
        }, dataPost);
    }
});

app.put("/countries/:pais", (req, res) => {
    let pais = req.params.pais;
    let dataPut = req.body;
    putCountry( data => {
            res.json(data);
    }, pais, dataPut);
});

app.delete("/countries/:pais", (req, res) => {
    let pais = req.params.pais;
    deleteCountry( msj => {
            res.json(msj);
    }, pais);
});

app.listen(8080);
