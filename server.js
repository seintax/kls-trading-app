const os = require("os")
const dotenv = require("dotenv").config()
var dotenvExpand = require("dotenv-expand")
dotenvExpand.expand(dotenv)

const cors = require("cors")
const path = require("path")
const express = require("express")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")

const errors = require('./res/errors/errors')
const corsoptions = require('./res/secure/options')
const approutes = require('./routes')

const port = process.env.API_PORT || 5201

const app = express()

// enable body as json format
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(cors(corsoptions))
app.use('/', express.static(path.join(__dirname, '/public')))
app.use('/', require('./res/routes/root'))

app.use('/app', approutes.transaction)
app.use('/app', approutes.dispensing)
app.use('/app', approutes.credit)
app.use('/app', approutes.payment)
app.use('/app', approutes.refund)
app.use('/app', approutes.returned)
app.use('/app', approutes.reimburse)

app.use('/app', approutes.purchase)
app.use('/app', approutes.receivable)
app.use('/app', approutes.delivery)
app.use('/app', approutes.receipt)
app.use('/app', approutes.inventory)
app.use('/app', approutes.transfer)
app.use('/app', approutes.transmit)

app.use('/app', approutes.category)
app.use('/app', approutes.masterlist)
app.use('/app', approutes.option)
app.use('/app', approutes.variant)
app.use('/app', approutes.supplier)
app.use('/app', approutes.customer)
app.use('/app', approutes.branch)

app.use('/app', approutes.account)
app.use('/app', approutes.schedule)
app.use('/app', approutes.expenses)

app.use('/app', approutes.complex)

app.all('*', (req, res) => {
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, '/pages', 'error.html'))
    } else if (req.accepts('json')) {
        res.json({
            success: false,
            message: 'Resource does not exist.'
        })
    } else {
        res.type('txt').send('404 Error: Resource does not exist.')
    }
})

app.use(errors.notFound)
app.use(errors.errhandler)

app.listen(port, () => {
    let wifi = os.networkInterfaces()['Wi-Fi']
    let ether = os.networkInterfaces()['Ethernet']
    let ip = "localhost"
    if (wifi !== undefined) {
        ip = wifi[1].address
    }
    if (ether !== undefined) {
        ip = ether[1].address
    }
    if (wifi === undefined && ether === undefined) {
        console.log('Serving via localhost...\n')
        console.error(`\x1b[41m`, `ERROR`, '\x1b[0m', `No ethernet or wifi network.`)
    }
    else {
        console.log(`Serving at ${ip} on port ${port}`)
        console.log(`Started on ${new Date()}.\n`)
    }
})