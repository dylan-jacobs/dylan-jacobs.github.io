const express = require('express');
const cors = require('cors');
const Airtable = require('airtable');
try{
require('dotenv').config();
} catch (error) {console.log('Not applicable: ', error);}
const app = express();
const airtableAPIKey = process.env.AIRTABLE_API;
const airtableBaseID = process.env.AIRTABLE_BASE_ID;
const port = process.env.PORT || 5500;

const base = new Airtable({ apiKey: airtableAPIKey }).base(airtableBaseID);
const tableName = 'Debates';

// Enable CORS for communication between backend and frontend
app.use(cors());

// Route to fetch debates
app.get('/api/debates', async (req, res) => {
    try {
        const debates = [];
        base(tableName).select().eachPage(
            (records, fetchNextPage) => {
                records.forEach(record => {
                    debates.push(record.fields); // Push only fields to the result
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

app.listen(port, () => console.log(`Server running at ${port}`));
