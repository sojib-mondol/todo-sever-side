const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();

//initialization express app
const app = express();
const PORT = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

//mongo uri
const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.zmcxwrx.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

// connect to mongoDB
mongoose.connect(uri),
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// Define a schema for the todo data
const todoSchema = new mongoose.Schema({
  todoName: String,
});

// Create a model based on the schema
const FormModel = mongoose.model("todo-tasks", todoSchema);

// post api
app.post("/todo", async (req, res) => {
  try {
    const { todoName } = req.body;
    //console.log(todoName);
    const todoData = new FormModel({
        todoName
    })

    await todoData.save();

    res.status(200).json({ message: "Form data saved successfully!" });
  } catch (err) {
    console.error("Error saving form data:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// get api
app.get("/todo", async (req, res) => {
    try {
      // Fetch all project data from MongoDB
      const todos = await FormModel.find({}, "-v"); // Exclude the "v" field from the response
  
      res.status(200).json(todos);
    } catch (err) {
      console.error("Error fetching projects:", err);
      res.status(500).json({ error: "Something went wrong" });
    }
  });


  // delete api
app.delete("/todo/:id", async (req, res) => {
  try {
      const todoId = req.params.id;
      // Use the provided todoId to delete the specific todo item from MongoDB
      const deletedTodo = await FormModel.findByIdAndDelete(todoId);

      if (!deletedTodo) {
          return res.status(404).json({ error: "Todo not found" });
      }

      res.status(200).json({ message: "Todo deleted successfully" });
  } catch (err) {
      console.error("Error deleting todo:", err);
      res.status(500).json({ error: "Something went wrong" });
  }
});




// start the server
app.listen(PORT, () => {
  console.log(`Server started on port: ${PORT}`);
});
app.get("/", (req, res) => {
  res.send(`Todo server is running at port : ${PORT}`);
});
