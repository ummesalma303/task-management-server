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
    // await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
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

      const filter = {_id: new ObjectId(result.insertedId)}
      const updateDoc = {
        // count
        $inc:{order:1}
      }
      const r = await taskCollection.updateOne(filter,updateDoc);
      console.log('-------58',result)
      console.log('-----59', r)
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

    // app.put("/reorder", async (req, res) => {
    //   const { reorderedTasks, parentId } = req.body; // Parent task collection ID
    
    //   try {
    //     const updatedTasks = reorderedTasks.map(task => ({
    //       _id: new ObjectId(task._id),
    //       title: task.title,
    //       description: task.description,
    //       order: task.order, // Add order field for sorting
    //     }));
    
    //     const result = await taskCollection.updateOne(
    //       { _id: new ObjectId(parentId) }, // Find the parent document
    //       { $set: { tasks: updatedTasks } } // Update only the tasks array
    //     );
    
    //     res.send(result);
    //   } catch (error) {
    //     console.error("Error updating tasks:", error);
    //     res.status(500).send("Internal Server Error");
    //   }
    // });
    
    app.delete('/delTasks/:id',async(req,res)=>{
      const id = req.params.id
      console.log('-------------`8`',id)
      const filter = {_id: new ObjectId(id)}
      const result = await taskCollection.deleteOne(filter)
      res.send(result)
    })

    app.patch('/updateTasks/:id',async(req,res)=>{
      const id = req.params.id
      const task = req.body
      console.log('-------------`8`',id)
      const filter = {_id: new ObjectId(id)}
      const updateDoc = {
        $set:{
          title: task.title,
          category: task.category,
          Description: task.Description,
          category: task.category,
        }
      }
      const result = await taskCollection.updateOne(filter,updateDoc)
      res.send(result)
    })


   // Example of reordering task
app.put('/reorder', async (req, res) => {
  try {
    const { taskId, newOrder, category } = req.body;
    const updatedTask = await taskCollection.updateOne(
      { _id: taskId, category: category },
      { $set: { order: newOrder } }
    );
    res.status(200).json(updatedTask);
    res.send(updatedTask)
  } catch (error) {
    res.status(500).json({ message: 'Failed to reorder task', error });
  }
});

  

  
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