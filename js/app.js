let bgImage = document.querySelector('.container')
let btn = document.querySelector('button')
let footer = document.querySelector('.footer')

if (window.navigator.geolocation) {
    const successfulLookup = position => {
        let { latitude, longitude } = position.coords;
        getData(latitude, longitude)
    }

    window.navigator.geolocation
        .getCurrentPosition(successfulLookup, console.log);
}

function getData(lat, lon) {
    let apiKey = '55ff5b9f1aa556e25d9767c01329b185'
    btn.disabled = true
    footer.innerHTML = ''
    let data;
    if (lat && lon) {
        data = `lat=${lat}&lon=${lon}`
    } else {
        let city = document.querySelector('#city').value
        data = `q=${city}`
    }
    currTemp(data, apiKey)
    forecast(data, apiKey, footer)
}
function currTemp(data, apiKey) {
    let currTempApi = `https://api.openweathermap.org/data/2.5/weather?${data}&appid=${apiKey}&units=metric`
    axios.get(currTempApi)
        .then(
            function (res) {
                handleBackground(bgImage)
                console.log(res.data);
                snowCheck(1)
                let img = `<img src="http://openweathermap.org/img/wn/${res.data.weather[0].icon}@2x.png" alt="icon"></img>`
                document.querySelector('.city').innerHTML = `${res.data.name}`
                document.querySelector('.temp').innerHTML = `°${res.data.main.temp} <br> <span>${img} <br> ${res.data.weather[0].main}</span>`
                if (res.data.weather[0].main === 'Thunderstorm' || res.data.weather[0].main === 'Rain') {
                    new RainyDay({
                        image: document.querySelector('.container')
                    })
                }
                snowCheck(res.data.weather[0].main)
            }
        )
        .catch(
            function (err) {
                console.log(err);
                document.querySelector('.city').innerHTML = err.response.data.message
            }
        )

}

function forecast(data, apiKey, footer) {
    let weather = []
    let forecastApi = `https://api.openweathermap.org/data/2.5/forecast?${data}&appid=${apiKey}&units=metric`
    axios.get(forecastApi)
        .then(
            function (res) {
                // console.log(res.data);
                let data = res.data.list
                for (let i = 0; i < data.length; i++) {
                    const element = data[i];
                    let d = new Date(element.dt_txt).getHours()
                    if (d === 0) {
                        weather.push(element)
                    }
                }
                console.log(weather);
                let dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                for (let i = 0; i < weather.length; i++) {
                    const element = weather[i];
                    let day = `<span>${dayNames[new Date(element.dt_txt).getDay()]}</span>`
                    let img = `<img src="http://openweathermap.org/img/wn/${element.weather[0].icon}@2x.png" alt="icon">`
                    let temp = `<span>${element.main.temp}</span>`
                    footer.innerHTML += `<div class="days"> ${day} ${img} ${temp}</div>`
                }
                btn.disabled = false

            }
        )
        .catch(
            function (err) {
                // console.log(err);
                document.querySelector('.city').innerHTML = err.response.data.message
            }
        )
}

function handleBackground(bgImage) {
    let d = new Date()
    if (d.getHours() < 12) {
        console.log(d.getHours());
        bgImage.style.background = "url('./img/rising.jpg') no-repeat center"
    } else if (d.getHours() < 15) {
        console.log(d.getHours());
        bgImage.style.background = "url('./img/noon.jpg') no-repeat center"
    } else if (d.getHours() < 20) {
        console.log(d.getHours());
        bgImage.style.background = "url('./img/set.jpg') no-repeat center"
    } else {
        console.log(d.getHours());
        bgImage.style.background = "url('./img/night.jpg') no-repeat center"
        document.querySelector('body').style.backgroundColor = '#000a12'
    }
    bgImage.style.backgroundSize = 'cover'
    document.querySelector('#city').style.opacity = 0.5
    document.querySelector('button').style.opacity = 0.5
}

function snowCheck(msg) {
    let getCanvas = document.getElementById("snow");
    if (getCanvas && msg != 'Snow') {
        document.body.removeChild(getCanvas)
        return
    }
    if (msg == 'Snow') {
        let createCanvas = document.createElement('canvas')
        createCanvas.setAttribute('id', 'snow')
        document.body.appendChild(createCanvas)
        snow()
    }
}

// inspired design
// https://s3.amazonaws.com/blog.invisionapp.com/uploads/2018/05/weather-app-9.jpg

// https://stackoverflow.com/questions/11371550/change-hover-css-properties-with-javascript
// https://mubaidr.js.org/rainyday.js/#options
// https://www.w3schools.com/js/js_date_methods.asp
// https://github.com/HermannBjorgvin/SnowJs
