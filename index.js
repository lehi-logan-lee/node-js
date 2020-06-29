const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
require('dotenv').config();
const PORT = process.env.PORT || 5000;

// Require Magic: The Gathering Software Development Kit API wrapper
const mtg = require('mtgsdk');

// begin app
express()
    .use(express.static(path.join(__dirname, 'public')))
    .use(bodyParser.urlencoded({ extended: true }))
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'ejs')
    .get('/advanced', (req, res) => res.sendFile(path.join(__dirname, 'public/advanced.html')))
    .get('/results', (req, res) => res.sendFile(path.join(__dirname, 'public/results.html')))
    .get('/cards', (req, res) => res.render('pages/cards', { name: req.query.name }))
    .get('/search', (req, res) => {
        /* begin building query to mtgsdk */
        let terms = {};
        // if a search term was in the query add it to our query builder
        // basic search terms
        if (req.query.name) terms.name = req.query.name;
        if (req.query.color) terms.colors = Array.isArray(req.query.color) ? req.query.color.join(',') : req.query.color;
        // advanced search terms
        if (req.query.search_type == 'advanced') {
            if (req.query.expansion) terms.set = req.query.expansion;
            if (req.query.type) terms.types = Array.isArray(req.query.type) ? req.query.type.join(',') : req.query.type;
            if (req.query.supertype) terms.supertypes = Array.isArray(req.query.supertype) ? req.query.supertype.join(',') : req.query.supertype;
            if (req.query.sub) terms.subtypes = req.query.sub;
            if (req.query.rules) terms.text = req.query.rules;
            if (req.query.cmc) terms.cmc = req.query.cmc; // this stands for 'converted mana cost'
            if (req.query.power) terms.power = req.query.power;
            if (req.query.toughness) terms.toughness = req.query.toughness;
        }
        
        /* error handling */
        // basic search errors
        if (req.query.search_type == 'basic') {
            // was a card name supplied?
            if (req.query.name == null || req.query.name == '') {
                console.error('Card name required for basic search.');
                res.json([]);
                return;
            }
        }
        /* basic and advanced search errors */
        // were no terms supplied?
        if (terms == {}) {
            console.error('At least one search term is required to search.');
            res.json([]);
            return;
        }

        // if no errors were found and are query built with no issues, search the database using the wrapper
        mtg.card.where(terms).then(cards => {
            // sort cards in alphabetical order
            cards.sort((a, b) => {
                let nameA = a.name.toUpperCase();
                let nameB = b.name.toUpperCase();
                if (nameA < nameB) return -1;
                if (nameA > nameB) return 1;
                return 0;
            });
            // return JSON data for AJAX handling
            res.json(cards);
        });
    })
    .get('/getCard', (req, res) => {
        mtg.card.find(req.query.multiverseid).then(result => {
            res.json(result);
        });
    })
    .listen(PORT, () => console.log(`Listening on ${ PORT }`));