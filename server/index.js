if (typeof window === 'undefined') {
  global.window = {}
}

const express = require('express')
const {renderToString} = require('react-dom/server')
const SSR = require('../dist/search-server.js')
const path = require('path')
const fs = require('fs')
const data = require('./data/data.json')

const template = fs.readFileSync(path.join(__dirname,'../dist/search.html'), 'utf-8')
const server = (port) => {
  const app = express()
  app.use(express.static('dist'))

  app.get('/search', (req,res)=>{
    const html = renderMarkup(renderToString(SSR))
    res.status(200).send(html)
  })

  app.listen(port, () => {
    console.log('Server is running on port' + port)
  })
}

function renderMarkup (str) {
  const dataString = JSON.stringify(data)
  return template.replace('<!--HTML_PLACEHOLDER-->', str).replace('<!--INITIAL_DATA_PLACEHOLDER-->', `<script>window.__initial_data=${dataString}</script>`)
}

server(process.env.PORT || 3000)