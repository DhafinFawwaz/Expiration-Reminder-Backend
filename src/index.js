import * as dotenv from 'dotenv'
import express from 'express'
import process from 'process'
import { getDescription } from './gpt_helper.js'

const mongoose = require('mongoose')
const mongoData = process.env.DATABASE_URL;

mongoose.connect(mongoData)
const database = mongoose.connection;

database.on('error', (error) => {
  console.log(error)
})

database.once('connected', () => {
  console.log('Connected to Database')
})

dotenv.config()
const app = express()
app.use(express.json())


app.get("/api", async (req, res) => {
  const productName = req.query.productName;
  if(productName === "" || productName === undefined) {
    res.send("Please provide a product name")
    return
  }
  let description = ""

  // MongoDB Database

  //

  // Call the GPT-3 API
  // description = await getDescription(productName) 
  // console.log(description);

  res.send(description);
})


const PORT = process.env.PORT || 3000
app.listen(PORT, () => {console.log(`App listening on http://localhost:${PORT}`)});
