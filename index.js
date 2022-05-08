const express = require('express');
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

//Using for middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rgdai.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        await client.connect();
        const serviceCollection = client.db('wareHouseManage').collection('product');

        app.get('/product', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);
        })

        app.post('/product', async (req, res) => {
            const newProduct = req.body;
            const result = await serviceCollection.insertOne(newProduct);
            res.send(result);
        })

        // Delete Api 
        app.delete('/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await serviceCollection.deleteOne(query)
            res.send(result);
        })

    }
    finally {

    }
};
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('running my node mongo')
});

app.listen(port, () => {
    console.log('crud server is running');
})