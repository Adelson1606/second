
const express = require('express')
const router = express.Router()
// const axios = require('axios')



// router.get('/data', async function (req, res) {
//   const allData =await axios('https://jsonplaceholder.typicode.com/users')
//   const data = allData.data
//   res.send(data)
// })



const axios = require('axios');

const getProxy = async () => {
  const list = await axios.get('https://raw.githubusercontent.com/clarketm/proxy-list/master/proxy-list-raw.txt')
  const proxyList = list.data.split('\n')
  return (proxyList)
}

getProxy()


router.get('/data', async function (req, res) {


 

})

module.exports = router

