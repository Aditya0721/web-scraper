const express = require('express')
const axios = require("axios")
const scrapeit = require("scrape-it")
const cheerio = require("cheerio")

const app = express()

app.listen(8000, (err)=>{
  console.log("server started")
}).on('error', (err)=>{
  console.log(err)
})

axios.get("https://www.cebm.net/covid-19/in-patients-of-covid-19-what-are-the-symptoms-and-clinical-features-of-mild-and-moderate-case/")
.then(
    (res)=>{
        const $ = cheerio.load(res.data)
        const data = scrapeit.scrapeHTML($,{scrapedData:{
            listItem: "table", data: {
                createdAt: {
                    selector: ".date"
                  , convert: x => new Date(x)
                }
              , title: "a.article-title"
              , tags: {
                    listItem: ".tags > span"
                }
              , content: {
                    selector: "tbody"
                  , how: "text"
                }
              , traverseOtherNode: {
                    selector: ".upperNode"
                  , closest: "div"
                  , convert: x => x.length
                }
        }}})
        console.log(data.scrapedData[0].content.replace('\n', ""))
    })
.catch((err)=>{console.log(err)})

