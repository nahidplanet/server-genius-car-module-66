const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const query = require('express/lib/middleware/query');
const res = require('express/lib/response');

const port = process.env.PORT || 5000;
const app = express();

// middleWare 
app.use(cors());
app.use(express.json());
// user name : genius-car
// password : pq7hRn7uQ9qBGjoz
const uri = `mongodb+srv://genius-car:pq7hRn7uQ9qBGjoz@cluster0.qbxl7.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
  try {
    await client.connect();
    const serviceCollections = client.db("genius-car").collection("service");
    const orderCollections = client.db("genius-car").collection("order");

    app.get('/service', async(req, res) => {
      // query for movies that have a runtime less than 15 minutes
      const query = {};
      const cursor = serviceCollections.find(query);
      const service = await cursor.toArray();
      res.send(service);
    });
    app.get('/service/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id:ObjectId(id)}
      const service = await serviceCollections.findOne(query);
      res.send(service);
    });
    // add service 
    app.post('/service', async(req, res) => {
      const newService = req.body;
      const service = await serviceCollections.insertOne(newService);
      res.send(service);
    });
    // delete service 
    app.delete('/service/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: ObjectId(id)}
      const service = await serviceCollections.deleteOne(query);
      res.send(service);
    });

    // get service Order 
    app.post('/order', async(req, res) => {
      const getOrder = req.body;
      console.log(getOrder);
      const order = await orderCollections.insertOne(getOrder);
      res.send(order);
    });
    app.get('/order',async(req,res)=>{
      const email = req.query.email;
      console.log(email);
      const query = {email:email};
      const cursor = orderCollections.find(query);
      const orders = await cursor.toArray();
      res.send(orders)
    })
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

// 
app.get('/', (req, res) => {
  res.send("Node with Genius-car-service");
});
app.listen(port, () => {
  console.log("Genius-car server running", port);
})
// http://localhost:5000/service/