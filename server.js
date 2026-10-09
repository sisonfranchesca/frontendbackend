const express = require('express');
const {MongoClient} = require('mongodb')

const app = express();

app.use(express.json());

app.use('/', (req,res,next) => {
    console.log('Requesting the root directory...');
    next();
})

const uri = "mongodb://localhost:27017"
const client = new MongoClient(uri)

let db;

async function connectDB() {
    try{
        await client.connect()
        db = client.db("mydb");
        console.log("Connected successfully to MongoDB")
    } catch (error) {
        console.log("Database failed to connect", error)
    }
}

connectDB();

app.get("/", async(req, res) => {
    try{
        const collection = db.collection("Persons");
        const newRecord = {
            "id": 1,
            "firstName": "Pedro",
            "lastName": "Santos"
        }
        const result = await collection.insertOne(newRecord)
        res.status(201).json({
            message: "Record inserted successfully",
            insertedId: result.insertedId
        })
    } catch(error) {
        res.status(500).json({ 
            error: "Record failed to be inserted",
             details: error.message
            })

    }
})


app.listen(3000, () => console.log('Server successfully running on PORT 3000'))