const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
require('dotenv').config()


//middlewares
app.use(cors());
app.use(express.json());



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bxlow.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const itemsCollection = client.db("itemsDB").collection("items");

async function run() {
    try {
      await client.connect();
      console.log('db connected');
      
    app.get('/items',async(req,res)=>{
        const query = req.query;
        const cursor = itemsCollection.find(query);
        const result = await cursor.toArray();
        res.send(result);
    });
    app.get('/inventoryitem/:id',async(req,res)=>{
        const id = req.params.id;
        const query = {_id : ObjectId(id)}
        
        const result = await itemsCollection.findOne(query);
        res.send(result);
    });
    app.get('/myitems',async(req,res)=>{
        const query = req.query;
        const cursor = itemsCollection.find(query);
        const result = await cursor.toArray();
        res.send(result);
    })

    app.post('/items',async(req,res)=>{
        const data = req.body;
        const result = await itemsCollection.insertOne(data);

        res.send(result);
    })
    app.put('/inventoryitem/:id',async(req,res)=>{
        const id = req.params.id;
        const quantity = req.body.newQuantity;
        
        const filter = {_id : ObjectId(id)}
        const option = {upsert:true};
        const update = {
            $set : {
                quantity
            }
        };
        const result = await itemsCollection.updateOne(filter,update,option);
        res.send(result);

    })

    app.delete('/items/:id',async(req,res)=>{
        const id = req.params.id;
        const query = {_id:ObjectId(id)}
        const result = await itemsCollection.deleteOne(query);
        res.send(result);
        console.log(id);
    })

    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);

app.get('/',(req,res)=>{
    res.send('server is running');
});

app.listen(port,()=>{
    console.log('listening to port',port)
})