/* eslint-disable import/extensions */
/* eslint-disable no-console */
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const farmBuildingsRouter = require('./routes/farmBuildings.js');
const farmUnitsRouter = require('./routes/farmUnits.js');

const app = express();

app.use(helmet());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cors());

app.use('/api/v1/farmBuildings', farmBuildingsRouter);
app.use('/api/v1/farmUnits', farmUnitsRouter);

app.use((req, res) => {
  res.status(404).send('404: Page not found');
});

app.listen(4002, () => {
  console.log('Server app listening on port 4002!');
});
