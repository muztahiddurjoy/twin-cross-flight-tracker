let socket = io()
let deviceDrop = document.getElementById('device_select')
let button = document.getElementById('requestConnect')
let refresh = document.getElementById('refresh')
let conTitle = document.getElementById('contitle')
let connected = document.getElementById('succonTitle')
let conpanel = document.getElementById('no_connection')
//Raw Data Related
let raw = document.getElementById('raw')
let rawIndicator = document.getElementById('rawinDicator')
//Temperature Related
const temp = document.getElementById('tempProgress')
const humid = document.getElementById('humidProgress')
const tempText = document.getElementById('tempText')
const humidText = document.getElementById('humidText')
//Timer related
let minutes = 0
let seconds = 0
let chartInd = 0
let chartbasearr = []
const minute = document.getElementById('minute')
const second = document.getElementById('seconds')
//Gyro Data
let xAxisarr = []
let yAxisarr = []
let zAxisarr = []

let address = null
let typed = null

window.addEventListener('load',()=>{
    setTimeout(() => { 
        typed = new Typed('#contitle', {
            strings: ["No Signal","No Signal!"],
            typeSpeed: 10,
            loop:false
        });
    }, 2000);
})


    const ctx = document.getElementById('gyrochart');
    setInterval(() => {
        chartbasearr.push(chartInd+1)
        new Chart(ctx, {
            type: 'line',
            data: {
              labels: chartbasearr,
              datasets: [{
                label: 'X Axis',
                data: xAxisarr,
                borderWidth: 1
              },
              {
                label: 'Y Axis',
                data: yAxisarr,
                borderWidth: 1
              },
              {
                label: 'Z Axis',
                data: zAxisarr,
                borderWidth: 1
              }
            ]
            },
            options: {
              scales: {
                y: {
                  beginAtZero: true
                }
              }
            }
          });
    }, 50);
   


socket.on('message',function(message){
    if(message=="device_connected"){
       if(typed!==null){
            typed = null
            typed = new Typed('#contitle', {
                strings: ["Device Connected","Connection Established"],
                typeSpeed: 10,
                startDelay: 1000,
                loop:false
            });
       }
       setInterval(() => {
            if(seconds==59){
                minutes++
                seconds=0
            }
            seconds++
            minute.innerHTML = String(minutes).padStart(2,'0')
            second.innerHTML = String(seconds).padStart(2,'0')
       }, 1000);
       setTimeout(() => {
        conpanel.classList.add('vanish')
       }, 2000);
    }
    if(message == "error"){
        alert("Error Muztahid!!")
    }
    else{
        if(Array.isArray(message)){
            while(deviceDrop.firstChild){
                deviceDrop.removeChild(deviceDrop.lastChild)
            }
            message.forEach((v,i)=>{
                if(i===0){
                    address = v.deviceAddress
                }
                let selectChild = document.createElement('option')
                selectChild.innerHTML = v.deviceName
                selectChild.setAttribute('value',v.deviceAddress)
                selectChild.classList.add('deviceItem')
                deviceDrop.appendChild(selectChild)
            })
        }
    }
})

socket.on('received',function(data){
    rawIndicator.classList.remove('bg-red-700')
    rawIndicator.classList.add('bg-green-700')
    const json = JSON.parse(data)
    setTimeout(() => {
        rawIndicator.classList.remove('bg-green-700')
        rawIndicator.classList.add('bg-red-700')
    }, 10);
    const child = document.createElement('li');
    child.innerHTML = JSON.stringify(json, null, "  ")
    raw.appendChild(child)
    raw.scrollTo(0,raw.scrollHeight)
    temp.style.strokeDashoffset = 330-(Number(json.temperature.temperature)*6.6)
    humid.style.strokeDashoffset = 330-(Number(json.temperature.humidity)*3.3)
    humidText.innerHTML = json.temperature.humidity
    tempText.innerHTML = json.temperature.temperature
})
refresh.addEventListener('click',function(){
    socket.emit('device-request',{status:true})
})
deviceDrop.addEventListener('change',function(e){
    address = e.target.value
})
button.addEventListener('click',function(){
   socket.emit("device-select",address)
})

