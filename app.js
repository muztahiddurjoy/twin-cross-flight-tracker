const {Server} = require('socket.io')
const express = require('express')
const path = require('path')
const {createServer}= require('http')
const cors = require('cors')
const SerialPort = require('serialport')
const app = express()
const httpServer = createServer(app)
const parsers = SerialPort.parsers
const socket = new Server(httpServer)
const parser = new parsers.Readline()
const fs = require('fs')
const usbDetect = require('usb-detection')
const {usb,getDeviceList} = require('usb')
app.use(cors())
app.use(express.static('public'))
usbDetect.startMonitoring()
// console.log(getDeviceList())
// usbDetect.on('add', function(device) { console.log('add', device); });

// try{

//}
// catch(err){
//     console.log(err)
// }

usbDetect.on('change', function(device) { console.log('change', device); });

app.get('/',async(req,res)=>{
    res.sendFile(`${__dirname}/public/index.html`)
})


socket.on('connection',(sock)=>{
        usbDetect.find(function(err, devices) { 
            if(err){
                sock.send('error')
            }
            else{
                sock.send(devices)
            }
        });
    sock.on('device-request',function(){
        usbDetect.startMonitoring() 
        usbDetect.find(function(err, devices) { 
            if(err){
                sock.send('error')
            }
            else{
                sock.send(devices)
            }
        });
    })
    sock.on('device-select',function(message){
        
        let port = new SerialPort(`COM${message}`,{
            baudRate:9600,
            dataBits:8,
            parity:'none',
            stopBits:1,
            flowControl:false
        })
        port.on('open', function() {
            sock.send('device_connected')
        })
        port.pipe(parser)
        parser.on('data',(line)=>{
          sock.emit('received',line)
        })
    })
   
})

httpServer.listen(4000,()=> console.log('Listening at 4000'))