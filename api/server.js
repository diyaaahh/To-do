const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://0.0.0.0:27017/Users',{
    useNewUrlParser : true,
    useUnifiedTopology: true
}).then(() => console.log("Connected to db!"))
.catch(console.error);

const Todo = require('./models/model');

app.get('/todos' , async (req,res) => {
    const todos = await Todo.find();
    res.json(todos);
});

app.post('/todo/new' , (req, res) => {
    const todo = new Todo({
        text : req.body.text
    });
    todo.save();

    res.json(todo);
});

app.delete('/todo/delete/:id', async (req, res) => {
	const result = await Todo.findByIdAndDelete(req.params.id);

	res.json({result});
});

app.get('/todo/complete/:id', async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);

        // Check if a todo with the specified ID was found
        if (!todo) {
            return res.status(404).json({ error: 'Todo not found' });
        }

        // Toggle the 'complete' property
        todo.complete = !todo.complete;

        // Save the updated todo
        await todo.save();
        
        res.json(todo);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.put('/todo/update/:id', async (req, res) => {
	const todo = await Todo.findById(req.params.id);

	todo.text = req.body.text;

	todo.save();

	res.json(todo);
});


app.listen(3001, () => console.log("Server strated on port 3001! on  "));