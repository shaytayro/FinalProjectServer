const express = require("express");

const app = express();


const cors= require('cors');
app.use(cors())
app.options('*',cors())

app.use(express.json());

const port = process.env.PORT || 3000; //environment variable
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

const UserModule=require("./UserModule");
const POIsModule=require("./TagModule");

app.use('/users',UserModule);
app.use('/Tags',POIsModule);



