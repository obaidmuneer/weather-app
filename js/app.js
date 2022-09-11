
function getData() {
    let city = document.querySelector('#city').value
    let footer = document.querySelector('.footer')
    let apiKey = '55ff5b9f1aa556e25d9767c01329b185'
    let bgImage = document.querySelector('.container')
    footer.innerHTML = ''

    currTemp(city, apiKey)
    forecast(city, apiKey, footer)
    handleBackground(bgImage)
}

function currTemp(city, apiKey) {
    let currTempApi = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    axios.get(currTempApi)
        .then(
            function (res) {
                console.log(res.data);
                let img = `<img src="http://openweathermap.org/img/wn/${res.data.weather[0].icon}@2x.png" alt="icon"></img>`
                document.querySelector('.city').innerHTML = `${res.data.name}`
                document.querySelector('.temp').innerHTML = `°${res.data.main.temp} <br> <span>${img} <br> ${res.data.weather[0].main}</span>`
            }
        )
        .catch(
            function (err) {
                // console.log(err);
                document.querySelector('.city').innerHTML = err.response.data.message
            }
        )

}

function forecast(city, apiKey, footer) {
    let weather = []
    let forecastTemp = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
    axios.get(forecastTemp)
        .then(
            function (res) {
                // console.log(res.data);
                let data = res.data.list
                // console.log(res.data.list);
                for (let i = 0; i < data.length; i++) {
                    const element = data[i];
                    let d = new Date(element.dt_txt).getHours()
                    // console.log(d);
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
    // console.log(d.getHours());
    if (d.getHours() < 12) {
        console.log(d.getHours());
        bgImage.style.background = "url('../img/rising.jpg') no-repeat center"
    } else if (d.getHours() < 15) {
        console.log(d.getHours());
        bgImage.style.background = "url('../img/noon.jpg') no-repeat center"
    } else if (d.getHours() < 20) {
        console.log(d.getHours());
        bgImage.style.background = "url('../img/set.jpg') no-repeat center"
    } else {
        console.log(d.getHours());
        bgImage.style.background = "url('../img/night.jpg') no-repeat center"
    }
    bgImage.style.backgroundSize = 'cover'
}
