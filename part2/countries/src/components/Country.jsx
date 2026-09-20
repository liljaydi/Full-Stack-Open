const Country = ({ country, weather }) => {
    console.log('rendering country')

    if (weather) {
        console.log(`temp: ${weather.temp}`)
        console.log(`wind: ${weather.wind}`)
    }

    const languages = Object.values(country.languages)
    console.log(languages)

    return (
        <>
            <h1>{country.name.common}</h1>
            <p>Capital {country.capital}</p>
            <p>Area {country.area}</p>

            <h2>Languages</h2>
            <ul>
                {languages.map(language => <li key={language}>{language}</li>)}
            </ul>

            <img src={country.flags.png} alt={country.flags.alt} />
            {weather
                ? <div>
                    <h2>Weather in {country.name.common}</h2>
                    <p>Temperature {weather.temp} Celcius</p>
                    <img 
                        src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`} 
                        alt="weather icon"
                    />
                    <p>Wind {weather.wind}</p>
                </div>
                : null
            }
        </>
    )
}

export default Country