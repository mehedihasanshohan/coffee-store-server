const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// middleware
app.use(cors());
app.use(express.json());

// mhshohan01
// 7fEb7NtWJBjjgOJn

// mongodb connecting functionality starts here
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.satrpnv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
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

    const coffeeCollection = client.db('coffeeDB').collection('coffee');
    const userCollection = client.db('coffeeDB').collection('users');

    // get all cofee data from the MongoDB database
    app.get('/coffee', async(req,res)=> {
      const cursor = coffeeCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

      // update coffee
   app.get('/coffee/:id', async (req, res) => {
       const id = req.params.id;
       const query = { _id: new ObjectId(id) }
       const result = await coffeeCollection.findOne(query);
       res.send(result);
        })

    // receive data from client side
    app.post('/coffee', async(req, res) =>{
      const newCoffee = req.body;
      console.log(newCoffee);
      const result = await coffeeCollection.insertOne(newCoffee);
      res.send(result);
    })

    // update coffee
     app.put('/coffee/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const updatedCoffee = req.body;
            const coffee = {
             $set: {
              name: updatedCoffee.name,
              quantity: updatedCoffee.quantity,
              supplier: updatedCoffee.supplier,
              taste: updatedCoffee.taste,
              price: updatedCoffee.price,
              details: updatedCoffee.details,
              photo: updatedCoffee.photo
            }
          }

            // const updatedDoc = {
            //     $set: {
            //         name: updatedCoffee.name,
            //         supplier: updatedCoffee.supplier
            //     }
            // }

            const result = await coffeeCollection.updateOne(filter, coffee, options);
            res.send(result);
        })

    // delete data
    app.delete('/coffee/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await coffeeCollection.deleteOne(query);
      res.send(result);
    })

    // users related api
    app.get('/users', async (req, res) => {
      const cursor = userCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.post('/users', async(req, res) => {
      const newUser = req.body;
      console.log('creating new user', newUser);
      const result = await userCollection.insertOne(newUser);
      res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
// mongodb connecting functionality ends here

app.get('/', (req, res) => {
  res.send('coffee making server is running')
})

app.listen(port, ()=> {
  console.log(`coffee server is runnig on port: ${port}`)
})