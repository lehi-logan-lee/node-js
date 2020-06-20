const express = require('express')
var bodyParser = require('body-parser');
const path = require('path')
const PORT = process.env.PORT || 5000

express()
  .use(express.static(path.join(__dirname, 'public')))
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .post('/postage', (req, res) => {
    const weight = +req.body.weight
    const type = req.body.type
    const obj = { weight: weight, type: type, result: calculateRate(weight, type) }

    res.render('pages/postage', obj)
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))

  function calculateRate(weight, type) {
    let baseValue = 0;
    const rate = 0.15;
      switch(type) {
        case 'Letters (Stamped)':
          baseValue = 0.55;
          break
        case 'Letters (Metered)':
            baseValue = 0.50;
          break
        case 'Large Envelopes (Flats)':
            baseValue = 1.00;
          break
        case 'First-Class Package Service—Retail':
            baseValue = 0.35;
          break
      }

      return (baseValue + (Math.ceil(weight) - 1) * 0.15).toFixed(2);
  }