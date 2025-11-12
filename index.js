const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

const uri = "mongodb+srv://PlateShareDB:QtW2oIH3dzxY7t2G@cluster0.eclygum.mongodb.net/?appName=Cluster0";

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

async function run() {
    try {
        await client.connect();
        console.log("✅ MongoDB Connected Successfully");

        const DB = client.db("PlateShareDB");
        const foodCollection = DB.collection("foods");
        const requestedFoodCollection = DB.collection("requested_foods");

        /* ----------------------------- HOME FOODS ----------------------------- */

        // Add food for Home Page
        app.post("/home_foods", async (req, res) => {
            try {
                const food = req.body;
                const newFoodData = { ...food, status: "available" };
                const result = await foodCollection.insertOne(newFoodData);
                res.send(result);
            } catch (err) {
                res.status(500).send({ error: err.message });
            }
        });

        // Get foods for Home Page
        app.get("/home_foods", async (req, res) => {
            try {
                const sortFields = { serves: -1 };
                const cursor = foodCollection.find().sort(sortFields).limit(6);
                const result = await cursor.toArray();
                res.send(result);
            } catch (err) {
                res.status(500).send({ error: err.message });
            }
        });

        // Update Home Foods
        app.patch("/home_foods/:id", async (req, res) => {
            try {
                const id = req.params.id;
                const filter = { _id: new ObjectId(id) };
                const updateFood = req.body;
                const updateFields = {};

                if (updateFood.serves) updateFields.serves = updateFood.serves;
                if (updateFood.status) updateFields.status = updateFood.status;

                const updateDoc = { $set: updateFields };
                const result = await foodCollection.updateOne(filter, updateDoc);
                res.send(result);
            } catch (err) {
                res.status(500).send({ error: err.message });
            }
        });

        /* ----------------------------- AVAILABLE FOODS ----------------------------- */

        // Get single food by ID
        app.get("/available_foods/:id", async (req, res) => {
            try {
                const id = req.params.id;
                const query = { _id: new ObjectId(id) };
                const result = await foodCollection.findOne(query);
                res.send(result);
            } catch (err) {
                res.status(500).send({ error: err.message });
            }
        });

        // Get all available foods
        app.get("/available_foods", async (req, res) => {
            try {
                const result = await foodCollection.find().toArray();
                res.send(result);
            } catch (err) {
                res.status(500).send({ error: err.message });
            }
        });

        // Add available food
        app.post("/available_foods", async (req, res) => {
            try {
                const food = req.body;
                const newFoodData = { ...food, status: "available" };
                const result = await foodCollection.insertOne(newFoodData);
                res.send(result);
            } catch (err) {
                res.status(500).send({ error: err.message });
            }
        });

        // Update food
        app.patch("/available_foods/:id", async (req, res) => {
            try {
                const id = req.params.id;
                const filter = { _id: new ObjectId(id) };
                const updateFood = req.body;
                const updateFields = {};

                if (updateFood.foodName) updateFields.foodName = updateFood.foodName;
                if (updateFood.category) updateFields.category = updateFood.category;
                if (updateFood.foodQuantity) updateFields.foodQuantity = updateFood.foodQuantity;
                if (updateFood.pickupLocation) updateFields.pickupLocation = updateFood.pickupLocation;
                if (updateFood.expireDate) updateFields.expireDate = updateFood.expireDate;
                if (updateFood.foodImage) updateFields.foodImage = updateFood.foodImage;
                if (updateFood.donatorName) updateFields.donatorName = updateFood.donatorName;
                if (updateFood.donatorEmail) updateFields.donatorEmail = updateFood.donatorEmail;

                const update = { $set: updateFields };
                const result = await foodCollection.updateOne(filter, update);
                res.send(result);
            } catch (err) {
                res.status(500).send({ error: err.message });
            }
        });

        // Delete a food
        app.delete("/available_foods/:id", async (req, res) => {
            try {
                const id = req.params.id;
                const query = { _id: new ObjectId(id) };
                const result = await foodCollection.deleteOne(query);
                res.send(result);
            } catch (err) {
                res.status(500).send({ error: err.message });
            }
        });



        // Request a food
        app.post("/requested_foods", async (req, res) => {
            try {
                const { foodId, userEmail, foodName } = req.body;

                if (!foodId || !userEmail || !foodName) {
                    return res.status(400).send({ error: "Missing required fields" });
                }

                const result = await requestedFoodCollection.insertOne(req.body);
                res.send(result);
            } catch (err) {
                res.status(500).send({ error: err.message });
            }
        });

        // Get all requested foods by specific user email
        app.get("/requested_foods", async (req, res) => {
            try {
                const email = req.query.email;
                if (!email) {
                    return res.status(400).send({ error: "Email query parameter is required" });
                }

                const query = { userEmail: email };
                const result = await requestedFoodCollection.find(query).toArray();
                res.send(result);
            } catch (err) {
                res.status(500).send({ error: err.message });
            }
        });

        app.delete("/requested_foods/:id", async (req, res) => {
            try {
                const id = req.params.id;
                const query = { _id: new ObjectId(id) };
                const result = await requestedFoodCollection.deleteOne(query);
                res.send(result);
            } catch (err) {
                res.status(500).send({ error: err.message });
            }
        });


        app.get("/", (req, res) => {
            res.send("🍽️ PlateShare Server is Running Successfully!");
        });

    } finally {

    }
}

run().catch(console.dir);

app.listen(port, () => {
    console.log(`🚀 PlateShare Server running on port ${port}`);
});
