const express = require('express');
const cors = require('cors');
const app = express();

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};

app.use(cors(corsOptions)); 

app.use(express.json());

const authRouter = require("./routes/auth");
const dashboardRouter = require("./routes/dashboard");
const casemanagementRouter = require("./routes/casemanagement");
const addclientRouter = require("./routes/addclient");
const clientmanagementRouter = require("./routes/clientmanagement");
const clientDeleteServer = require("./routes/deleteclient");
const editClientRouter = require('./routes/editclient');
const addCaseRouter = require('./routes/addcase');
const editCaseRouter = require('./routes/editcase');
const deleteCaseRouter = require('./routes/deletecase');

app.use('/api', authRouter);
app.use('/api', dashboardRouter);
app.use('/api', casemanagementRouter);
app.use('/api', addclientRouter);
app.use('/api', clientmanagementRouter);
app.use('/api', clientDeleteServer);
app.use('/api', editClientRouter);
app.use('/api', addCaseRouter);
app.use('/api', editCaseRouter);
app.use('/api', deleteCaseRouter);

const port = 5000;

const db = require('./db');

app.listen(port, () => console.log(`Server ${port} portunda çalışıyor`));
