const express = require('express')
const bodyParser = require('body-parser')
const http = require('http');
const WebSocket = require('ws');
const { default: axios } = require('axios');
const HttpsProxyAgent = require('https-proxy-agent');

const app = express();

const server = http.createServer(app);


app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With')

    next()
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))



// const proxyApi = 'https://raw.githubusercontent.com/a2u/free-proxy-list/master/free-proxy-list.txt';
const proxyApi = 'https://raw.githubusercontent.com/clarketm/proxy-list/master/proxy-list-raw.txt';
const initialProxyList = axios.get(proxyApi)
let proxyIdx = 0

console.log('got proxy list', new Date())

function request(url, proxyIp) {
    return axios({
        method: 'GET',
        url,
        proxy: false,
        httpsAgent: new HttpsProxyAgent(`http://${proxyIp}`)
    })
}

const wss = new WebSocket.Server({ server });
wss.on('connection', async (ws) => {
    const list = await initialProxyList
    const proxyList = list.data.split('\n')



    const intid = setInterval(async () => {

        console.log('attepting request')

        try {
            if (proxyIdx === proxyList.length) {
                proxyIdx = 0
            }

            const resp = await request('https://www.live-rates.com/rates', proxyList[proxyIdx++])
            if (resp.data.length === 1) {
                throw new Error('limit');
            }

            ws.send(JSON.stringify(resp.data))


        } catch (err) {
            console.error(err)
        }

    }, 3000)

    ws.on('close', () => {
        clearInterval(intid);
    })


});

server.listen(process.env.PORT || 8080, () => {
    console.log(`Server started on port ${server.address().port} :)`);
});