const express = require('express');
const cors = require('cors');
const Airtable = require('airtable');

const app = express();
const PORT = 5500;

const airtableAPIKey = 'patxtimTn04JsMYfm.44ac81076169a3d10e074744a91fe6d6666f83495081c23e08de38088a24c004';
const baseID = 'appRSkomBUwtwjCjN';
const tableName = 'Debates';

const base = new Airtable({ apiKey: airtableAPIKey }).base(baseID);

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
