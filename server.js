const express = require('express')
const axios = require('axios');
const path = require("path");

module.exports = {
  app: function () {
      const app = express()
      const indexPath = path.join(__dirname, 'index.html')
      const publicPath = express.static(path.join(__dirname, 'public'))

      app.use('/public', publicPath)
      app.get('/', function (_, res) { res.sendFile(indexPath) })

    app.get('/api/forecast/:lat/:lng', function(req, res) {
      axios.get('https://api.darksky.net/forecast/API_KEY/'+req.params.lat+','+req.params.lng+'?units=si')
        .then(function (response) {
          res.json(response.data);
        })
        .catch(function (error) {
          console.log(error);
        });
    });
    return app
  }
}
