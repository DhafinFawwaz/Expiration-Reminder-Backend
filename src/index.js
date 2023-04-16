import * as dotenv from 'dotenv'
import express from 'express'
import process from 'process'
import { getDescription } from './gpt_helper.js'
import mongoose, { mongo } from 'mongoose'

dotenv.config()
const app = express()
app.use(express.json())

const mongoData = process.env.DATABASE_URL;
mongoose.connect(mongoData)
const database = mongoose.connection;

database.on('error', (error) => {
  console.log(error)
})

database.once('connected', () => {
  console.log('Connected to Database')
})



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
  console.log("\nRequesting description...");
  const productName = req.query.productName;
  if(productName === "" || productName === undefined) {
    console.log("No productName provided");
    res.send("Please provide a product name")
    return
  }
  let description = ""

  // MongoDB Database
  const collection = new mongoose.model('tes', dataSchema)
  await collection.find({productname: productName}).limit(1).then(async (data, error) => {
    if(error){ // Error
      console.log(error);
      return
    }else if(data.length > 0){ // productName found
      description = data[0].desc;
      console.log("Found description in database\ndata.desc: "+description);
      return
    }else{ // productName not found
      // Call the GPT-3 API
      console.log("No description found in database");
      
      console.log("\nCalling GPT-3 API\nproductName: " + productName)
      description = await getDescription(productName) 
      const data = {
        productname: productName,
        desc: description
      }
      console.log("\nInserting data into database");
      collection.insertMany([data])
      console.log("description: "+description);
      
      return
    }
  })

  res.send(description);
})


const PORT = process.env.PORT || 3000
app.listen(PORT, () => {console.log(`App listening on http://localhost:${PORT}`)});
