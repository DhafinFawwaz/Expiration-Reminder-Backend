import * as dotenv from 'dotenv'
import express from 'express'
import process from 'process'
import { getDescription } from './gpt_helper.js'
import mongoose from 'mongoose'
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

const dataSchema = new mongoose.Schema({
  productname: {
      required: true,
      type: String
  },
  desc: {
      required: true,
      type: String
  }
})


app.get("/api", async (req, res) => {
  const productName = req.query.productName;
  if(productName === "" || productName === undefined) {
    res.send("Please provide a product name")
    return
  }
  let description = ""

  // MongoDB Database
  const collection = new mongoose.model('tes', dataSchema)
  if(database.collection.find({productname: productName}).count() > 0) {
    database.collection.find({productname: productName}, (error, data) => {
      if(error){
          console.log(error)
        }else{
          description = data.desc;
          console.log("Found description in database\ndata.desc: "+description);
        }
      }
    )
  }
  else{

    // Call the GPT-3 API
    console.log("Calling GPT-3 API\nproductName: " + productName)
    description = await getDescription(productName) 
    data = {
      productname: productName,
      desc: description
    }
    console.log("\nInserting data into database");
    collection.insertMany([data])
    console.log("description: "+description);
  }

  console.log("Respond: "+description);
  res.send(description);
})


const PORT = process.env.PORT || 3000
app.listen(PORT, () => {console.log(`App listening on http://localhost:${PORT}`)});
