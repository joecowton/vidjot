const express = require('express');
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const app = express();

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost/vidjot-dev',{
  useMongoClient: true
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err))

// Load idea model
require('./models/Idea')
const Idea = mongoose.model('ideas')

app.engine('handlebars', exphbs({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')

app.use(bodyParser.urlencoded({ extended: false}))
app.use(bodyParser.json())

app.get('/',(req, res) => {
  const title = 'Welcome';
  res.render('index', {
    title: title
  });
});

app.get('/about',(req, res) => {
  res.render('about')
})

app.get('/ideas', (req, res) => {
  Idea.find({})
    .sort({date:'desc'})
    .then(ideas => {
      res.render('ideas/index', {
        ideas: ideas
      })

    })
})

app.get('/ideas/add', (req, res) => {
  res.render('ideas/add')
})

app.post('/ideas', (req, res) => {
  let errors = [];

  if(!req.body.title){
    errors.push({text:'please add a title'})
  }
  if(!req.body.details){
    errors.push({text:'please add details'})
  }
  if(errors.length > 0 ){
    res.render('ideas/add',{
      errors: errors,
      title: req.body.title,
      details: req.body.details
    });
  } else {
    const newUser = {
      title: req.body.title,
      details: req.body.details
    }
    new Idea(newUser)
      .save()
      .then(idea => {
        res.redirect('/ideas')
      })
  }
})

const port = 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
})
