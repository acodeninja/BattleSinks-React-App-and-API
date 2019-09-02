const express = require('express');
const app = express();

app.use(express.static('frontend/build'));

const port = process.env.PORT || 3000;
app.listen(port, console.log(`Listening on ${port}`));
