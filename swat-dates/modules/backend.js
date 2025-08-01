const express = require('express');
const cors = require('cors');
try{
    require('dotenv').config();
} catch (error) {
    console.log('Not applicable: ', error);
}
const app = express();

// Enable CORS for communication between backend and frontend
app.use(cors());

app.get('/', async (req, res) => {
    res.send('Welcome to Swat-Dates backend!');
});

app.get('/user', async (req, res) => {
    
});

const port = process.env.PORT || 5500;
app.listen(port, () => console.log(`Server running at ${port}`));
