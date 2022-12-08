const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const myDate = require(__dirname+'/myDate.js');
const database = require(__dirname+'/database.js');
const _ = require('lodash');


const app = express();
const port = process.env.PORT || 3001;


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));
app.set('view engine', 'ejs');


// Init database
database.main().catch(err => console.log(err));

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

app.get('/', async (req, res) => {
    res.render('index', {dayOfWeek: myDate.getDate(), taskListItems:await database.getTaskList("General"), listName:"General"});
});

app.post('/', (req, res) => {
    const itemName = String(req.body.newItem);
    const endpoint = String(req.body.endpoint);

    if(endpoint==="General"){
        database.addItemToTaskList(itemName, "General");
        res.redirect("/");
    }else{ // dinamic List
        console.log("New task added to "+endpoint+": "+ itemName);
        database.addItemToTaskList(itemName, endpoint);
        res.redirect("/"+endpoint);
    }
});


app.post('/delete', (req, res) => {
    const itemId = String(req.body.itemId);
    const endpoint = String(req.body.endpoint);

    if(endpoint==="General"){
        database.removeItemToTaskList(itemId, "General")
        res.redirect("/");
    }else{ // dinamic List
        database.removeItemToTaskList(itemId, endpoint)
        res.redirect("/"+endpoint);
    }
});

app.get('/:listTitle', async (req, res) => {
    const listTitle = _.capitalize(req.params.listTitle)
    console.log("listTitle: "+ listTitle);
    const listItems = await database.getTaskList(listTitle);
    res.render('index', {dayOfWeek: myDate.getDate(), taskListItems:listItems, listName:listTitle});
  });