const mongoose = require('mongoose');


const itemSchema = new mongoose.Schema({
    name: String,
});
const listSchema = new mongoose.Schema({
    name: String,
    items: [itemSchema]
});


const Item = mongoose.model("Item", itemSchema);
module.exports.Item = Item;
const List = mongoose.model("List", listSchema);
module.exports.List = List;


module.exports.main = main;
async function main() {
  await mongoose.connect('mongodb+srv://Admin:Bw2b80l9M3qm3E7t@cluster0.hk51adk.mongodb.net/todoListDB');  
  console.log("MongoDB conected");
  initDatabase();
}


function initDatabase(){ 
    const item1 = new Item({
      name: "Buy food",
    });
    const item2 = new Item({
      name: "Cook food",
    });
    const item3 = new Item({
        name: "Eat food",
    });

    const items = [item1, item2, item3];
    const listName = "General"

    List.find({name: listName},function(err, lists){
        if(err){
          console.log("Error: "+err)
        }else{
          if(lists.length==0){
            item1.save();
            item2.save();
            item3.save();
            
            createTaskList(listName, items);
          }
        }
      });
    console.log("Database initied");
}


module.exports.addItemToTaskList = addItemToTaskList;
function addItemToTaskList(itemName, taskList){
    const newItem = new Item({
      name: itemName,
    });
    newItem.save();

    List.updateOne({name: taskList}, {$push: {items: newItem}}, function(err) {
      if(err){
        console.log("Error: "+err);
      }else{
        console.log('Item "'+itemName+'" added to taskList "'+taskList+'"');
      }
    })
}


module.exports.getTaskList = getTaskList;
function getTaskList(listName){
    return new Promise((resolve, reject) => {
        List.findOne({name: listName}, function(err, list) {
           if (err) reject(err);
           if(list){
            resolve(list.items);
           }else{
            createTaskList(listName, []);
            resolve([]);
           }
        });
      });
}


module.exports.removeItemToTaskList = removeItemToTaskList;
function removeItemToTaskList(itemId, listName){
  console.log(itemId)

  Item.deleteOne({_id: itemId}, function(err) {
    if(err){
      console.log("Error: "+err);
    }else{
      console.log("Item deleted");
    }
  });

  List.findOneAndUpdate(
    {name: listName}, 
    {$pull: {
        items: {_id: itemId}
    }},
    function(err, results) {
      if(err){
        console.log("Error: "+err);
      }else{
        console.log("Item deleted from list. ");//+ results);
      }
    });
}


module.exports.createTaskList = createTaskList;
function createTaskList(listName, items){
  const list = new List({
    name: listName,
    items: items
  })
  list.save();
}