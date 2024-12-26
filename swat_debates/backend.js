const express = require('express');
const cors = require('cors');
const Airtable = require('airtable');
require('dotenv').config();
const airtableAPIKey = process.env.airtableAPIKey;
const airtableBaseID = process.env.airtableBaseID;

const app = express();
const PORT = 5500;

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

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
