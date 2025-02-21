require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
//middleware
app.use(express.json());
app.use(cors());


// 
//


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ot76b.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// console.log(uri)
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
    const taskCollection = client.db("TaskManager").collection("tasks");
    const userCollection = client.db("TaskManager").collection("users");
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");




// post user
    app.post("/user",async (req,res)=>{
      const user = req.body
      const result = await userCollection.insertOne(user);
      console.log(result)
      res.send(result)
    })
// post tasks
    app.post("/tasks",async (req,res)=>{
      const task = req.body
      const result = await taskCollection.insertOne(task);
      console.log(result)
      res.send(result)
    })
// get tasks
    app.get("/tasks",async (req,res)=>{
      // const task = req.body
      const result = await taskCollection.find().toArray();
      // console.log(result)
      res.send(result)
    })
// get tasks
    app.get("/tasks",async (req,res)=>{
      // const task = req.body
      const email = req.params.email
      const result = await taskCollection.findOne(email);
      // console.log(result)
      res.send(result)
    })
// put tasks
    // app.put("/reorder",async (req,res)=>{
    //   const { reorderedTasks} = req.body
    //   console.log('--------', reorderedTasks)
    //   const ids = reorderedTasks.map(task=>task._id)
    //   // const filter = {_id:new ObjectId(ids)}
    //   const filter = { _id: { $in: ids } };
    //   console.log('---74',ids)
    //   console.log('---76',filter)
    //   const updateDoc = {
    //     $set: { tasks: reorderedTasks } // Assuming you want to replace the entire tasks collection
    //   };
    //   const res = taskCollection.updateMany(filter,updateDoc)
    //   res.send( reorderedTasks)
    // })

    app.put("/reorder", async (req, res) => {
      const { reorderedTasks } = req.body;
    
      console.log('--------', reorderedTasks);
    
      const ids = reorderedTasks.map(task => task._id);
    
      const filter = { _id: { $in: ids } }; // Use $in operator to match multiple IDs
    
      console.log('---74', ids);
    
      const updateDoc = {
        $set: { tasks: reorderedTasks } // Assuming you want to replace the entire tasks collection
      };
    
      try {
        const result = await taskCollection.updateMany(filter, updateDoc);
        res.send(result);
      } catch (error) {
        console.error('Error updating tasks:', error);
        res.status(500).send('Internal Server Error');
      }
    });




    
    // app.put("/reorder", async (req, res) => {
    //   const { reorderedTasks } = req.body; // Reordered tasks with ids and their new order
    //   console.log('--------', reorderedTasks);
    
    //   // Prepare the update operations
    //   const updateOperations = reorderedTasks.map((task, i) => ({
    //     updateOne: {
    //       filter: { _id: new ObjectId(task._id) },
    //       update: { $set: { order: i } },  // Set the new order index
    //     }
    //   }));
    
    //   console.log(updateOperations);  // For debugging
    
    //   try {
    //     // Execute all update operations in bulk
    //     const result = await taskCollection.bulkWrite(updateOperations);
    //     console.log(result);
    
    //     // Return the result of the bulkWrite operation
    //     res.send(result);
    //   } catch (error) {
    //     console.error(error);
    //     res.status(500).send({ success: false, message: 'Failed to update tasks order' });
    //   }
    // });
    
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);










app.get("/", (req, res) => {
    res.send("Hello from assignment 12 Server..");
  });
  
  app.listen(port, () => {
    console.log(`assignment 12 is running on port ${port}`);
  });