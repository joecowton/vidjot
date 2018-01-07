const express = require('express');
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')

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

app.get('/',(req, res) => {
  const title = 'Welcome';
  res.render('index', {
    title: title
  });
});

app.get('/about',(req, res) => {
  res.render('about')
})

const port = 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
})
