const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const port = process.env.PORT || 5000;
// If I'm very bored I might host all data in a database -_-
const data = require('./data.json');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// API calls

app.get('/api/data', (req, res) => {
  res.send(data);
});


console.log(data);
if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'client/build')));
  // Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}
app.listen(port, () => console.log(`Listening on port ${port}`));
