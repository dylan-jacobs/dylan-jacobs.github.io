const mongodb = require('./mongodb.js');
const express = require('express');
const cors = require('cors');
const Airtable = require('airtable');
try{
    require('dotenv').config();
} catch (error) {
    console.log('Not applicable: ', error);
}
const app = express();
const airtableAPIKey = process.env.AIRTABLE_API;
const airtableBaseID = process.env.AIRTABLE_BASE_ID;
const base = new Airtable({ apiKey: airtableAPIKey }).base(airtableBaseID);
const tableName = 'Debates';

// Enable CORS for communication between backend and frontend
app.use(cors());

app.get('/', async (req, res) => {
    res.send('Welcome to Swat-Debates API!');
});

// Route to fetch debates
app.get(`/api/debates`, async (req, res) => {
    try {
        const debates = [];
        base(tableName).select().eachPage(
            (records, fetchNextPage) => {
                records.forEach(record => {
                    try{
                    var date = new Date(record.fields.when);
                    if (date.getTime() < Date.now()){
                        base(tableName).destroy(record.id);
                    }
                    else{
                        debates.push(record.fields); // Push only fields to the result
                    }
                    } catch(error){
                        console.log('Get records failed: ', error);
                    }
                });
                fetchNextPage();
            },
            err => {
                if (err) {
                    console.error(err);
                    res.status(500).send('Error retrieving debates');
                } else {
                    res.json(debates);
                }
            }
        );
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).send('Server error');
    }
});


const port = process.env.PORT || 5500;
app.listen(port, () => console.log(`Server running at ${port}`));
