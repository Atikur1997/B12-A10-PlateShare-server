const express = require('express');
const cors = require('cors');

//import file for mongoDB
const { MongoClient, ServerApiVersion } = require('mongodb');



const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;
//PlateShareDB
//QtW2oIH3dzxY7t2G

const uri = "mongodb+srv://PlateShareDB:QtW2oIH3dzxY7t2G@cluster0.eclygum.mongodb.net/?appName=Cluster0";

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        const DB = client.db('PlateShareDB')
        const foodCollection = DB.collection('foods')

        //foods for Home Page
        app.post('/available_foods', async (req, res) => {
            const food = req.body;
            const result = await foodCollection.insertOne(food);
            res.send(result);
        })
        //foods for Home Page
        app.get('/available_foods', async (req, res) => {
            const result = await foodCollection.find().toArray();
            res.send(result);
        })



        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");




    } finally {
        // Ensures that the client will close when you finish/error

    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('Running-Plate share Server')
})

app.listen(port, (req, res) => {
    console.log('Running Plate Share Server on port', port)
})
