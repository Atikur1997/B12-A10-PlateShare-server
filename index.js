const express = require('express');
const cors = require('cors');

//import file for mongoDB
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');



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
            const newFoodData = { ...food, status: 'available' }
            const result = await foodCollection.insertOne(newFoodData);
            res.send(result);
        })
        //foods for Home Page
        app.get('/available_foods', async (req, res) => {
            const result = await foodCollection.find().toArray();
            res.send(result);
        })
        // to find the a single food for details page
        app.get('/available_foods/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await foodCollection.findOne(query);
            res.send(result)
        })

        //update the product 
        app.patch('/available_foods/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const updateFood = req.body;
            const updateFields = {};
            if (updateFood.foodName) updateFields.foodName = updateFood.foodName;
            if (updateFood.foodQuantity) updateFields.foodQuantity = updateFood.foodQuantity;
            if (updateFood.pickupLocation) updateFields.pickupLocation = updateFood.pickupLocation;
            if (updateFood.expireDate) updateFields.expireDate = updateFood.expireDate;
            if (updateFood.foodImage) updateFields.foodImage = updateFood.foodImage;
            if (updateFood.donatorName) updateFields.donatorName = updateFood.donatorName;
            if (updateFood.donatorEmail) updateFields.donatorEmail = updateFood.donatorEmail;

            const update = { $set: updateFields };



            const result = await foodCollection.updateOne(filter, update);
            res.send(result);

        })
        //for delete an element

        app.delete('/available_foods/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await foodCollection.deleteOne(query);
            res.send(result);
        })


       




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
