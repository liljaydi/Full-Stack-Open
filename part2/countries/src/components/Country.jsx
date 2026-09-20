const Country = ({ country, weather }) => {
    console.log('rendering country')

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
                </div>
                : null
            }
        </>
    )
}

export default Country