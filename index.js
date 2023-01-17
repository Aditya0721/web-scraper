const express = require('express')
const axios = require("axios")
const scrapeit = require("scrape-it")
const cheerio = require("cheerio")
const e = require('express')

const app = express()

app.use(express.json())

app.listen(8000, (err)=>{
  console.log("server started")
}).on('error', (err)=>{
  console.log(err)
})

app.get("/wscrape",(req, res)=>{
  res.status(200).send("<h1>WEB SCRAPER<h1>")
})

app.get("/wscrape/scrapeit", (req, response)=>{
  let result = []
  axios.get(req.body.url)
  .then(
      (res)=>{
          const $ = cheerio.load(res.data)
          const data = scrapeit.scrapeHTML($,{scrapedData:{
              listItem: req.body.tag, data: {
                  createdAt: {
                      selector: ".date"
                    , convert: x => new Date(x)
                  }
                , title: "a.article-title"
                , content: {
                    selector : req.body.class!=null?`.${req.body.class}`:null,
                    how: "text"
                  }
                , traverseOtherNode: {
                      selector: ".upperNode"
                    , closest: "div"
                    , convert: x => x.length
                  }
          }}})
          console.log(data.scrapedData.length)
        if(data.scrapedData.length!=0){
         return response.status(200).send(data.scrapedData.map((element)=>{
           return element.content.replace(/\n/g, '');
         }))
        }
        else{
          return response.status(200).send(`there is no ${req.body.tag} tag present`)
        }
      })
  .catch((err)=>{console.log(err)})
})
// axios.get("https://www.cebm.net/covid-19/in-patients-of-covid-19-what-are-the-symptoms-and-clinical-features-of-mild-and-moderate-case/")
// .then(
//     (res)=>{
//         const $ = cheerio.load(res.data)
//         const data = scrapeit.scrapeHTML($,{scrapedData:{
//             listItem: "table", data: {
//                 createdAt: {
//                     selector: ".date"
//                   , convert: x => new Date(x)
//                 }
//               , title: "a.article-title"
//               , tags: {
//                     listItem: ".tags > span"
//                 }
//               , content: {
//                     selector: "tbody"
//                   , how: "text"
//                 }
//               , traverseOtherNode: {
//                     selector: ".upperNode"
//                   , closest: "div"
//                   , convert: x => x.length
//                 }
//         }}})
//         console.log(data.scrapedData[0].content.replace('\n', ""))
//     })
// .catch((err)=>{console.log(err)})

