const express = require('express')
const app = express()
const dotenv = require('dotenv')
const mongoose = require("mongoose")
const TodoTask = require("./models/TodoTask");

dotenv.config();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true}, () => {
    console.log("connected")
    // server will only run when connection is made
    app.listen(3000, () => console.log("surfs up"))
})

app.use('/static', express.static('public'))
// urlencoded will allow us to extract the data from the form by adding her to the body property of the request.
app.use(express.urlencoded({ extended: true }))

app.set('view engine', 'ejs')


//read the data from the database so when we enter the page or when we add a new item we can see it at our app.
app.get("/", (req, res) => {
    TodoTask.find({}, (err, tasks) => {
        res.render("todo.ejs", { todoTasks: tasks })
    })
})

app.post('/', async (req, res) => {
    const todoTask = new TodoTask({
        content: req.body.content
    })
    try {
        await todoTask.save()
        res.redirect('/')
    } catch (err) {
        res.redirect('/')
    }
})


//DELETE
app.route("/remove/:id").get((req, res) => {
    const id = req.params.id;
    TodoTask.findByIdAndRemove(id, err => {
        if (err) return res.send(500, err);
        res.redirect("/");
    });
});

