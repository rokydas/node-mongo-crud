const express = require('express');
const bodyParser = require('body-parser');

const password = 'm2dOrTyGQsJTXTQf';

const ObjectId = require('mongodb').ObjectID;

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://RokyDB:m2dOrTyGQsJTXTQf@cluster0.vetwi.mongodb.net/RokyDB?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    // res.send("Hello I am working")
    res.sendFile(__dirname + '/index.html');
})

client.connect(err => {
  const collection = client.db("RokyDB").collection("Testing");

  app.get('/users', (req, res) => {
    // collection.find({}).limit(5)
    collection.find({})
    .toArray( (err, documents) => {
      res.send(documents);
    })
  })

  app.post('/addUser', (req, res) => {
    const newUser = req.body;
    // console.log(newUser);
    collection.insertOne(newUser)

    .then( result => {
      console.log('User Added Successfully');
      // res.sendFile(__dirname + '/index.html');
      // res.send('Successfully added')
      res.redirect('/');
      
    })

  })

  app.get('/user/:id', (req, res) => {
    collection.find({_id: ObjectId(req.params.id)})
    .toArray((err, documents) => {
      res.send(documents[0]);
    })
  })

  app.delete('/delete/:id', (req, res) => {
    // console.log(req.params.id)
    collection.deleteOne({_id: ObjectId(req.params.id)})
    .then(result => {
      // console.log(result);
      res.send(result.deletedCount > 0);
    })
  })

  app.patch('/update/:id', (req, res) => {
    collection.updateOne({_id: ObjectId(req.params.id)}, {
      $set: {firstName: req.body.firstName, lastName: req.body.lastName}
    })
    .then(result => {
      // console.log(result);
      res.send(result.modifiedCount > 0)
    })
   

  })


  // const user = { name: 'Roky Das', age: 22, id: 18701035 };
  
  // console.log('Database connected');

  // client.close();
});


app.listen(3000);