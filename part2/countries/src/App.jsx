import { useState, useEffect } from 'react'
import axios from 'axios'

import Country from './components/Country'

const App = () => {
  const [countries, setCountries] = useState(null)
  const [country, setCountry] = useState(null)
  const [newCountry, setNewCountry] = useState('')
  const [tooManyMatches, setTooManyMatches] = useState(false)

  const handleCountryChange = e => {
    setNewCountry(e.target.value)
    console.log(e.target.value)

    if (e.target.value === '') {
      setCountries(null)
      setCountry(null)
      setTooManyMatches(false)
    }
  }

  useEffect(() => {
    if (newCountry !== '') {
      console.log('requesting...')

      axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
      .then(response => {
        setCountries([])
        const countries = response.data

        console.log('data recieved')
        const matchedCountries = countries.filter(country => 
          country.name.common.toLowerCase().includes(newCountry.toLowerCase()))

        if (matchedCountries.length > 10) {
          setTooManyMatches(true)

        } else if (matchedCountries.length > 1) {
          setCountries(matchedCountries.map(matchedCountry => matchedCountry.name.common))
          setTooManyMatches(false)

        } else if (matchedCountries.length === 1) {
          setCountry(matchedCountries[0].name.common)
          setTooManyMatches(false)

          console.log('found 1 country')
        } 
        
        console.log(matchedCountries.map(matchedCountry => matchedCountry.name.common))
      })
    }
  }, [newCountry])

  useEffect(() => {
    if (country) {
      console.log(`requesting ${country}`)

      axios
        .get(`https://studies.cs.helsinki.fi/restcountries/api/name/${country}`)
        .then(response => {
          const returnedCountry = response.data
          setCountries([returnedCountry])

          console.log(returnedCountry)
        })
    }
  }, [country])

  let countryToDisplay

  if (!countries) {
    console.log('no request')
    countryToDisplay = null
  } else if (tooManyMatches) {
    countryToDisplay = <p>Too many matches, specify another filter</p>
  } else if (countries.length > 1) {
    countryToDisplay = countries.map(country => <p key={country}>{country}</p>)
  } else if (countries.length === 1) {
    countryToDisplay = <Country country={countries[0]}/>
  } else {
    console.log('no country found')
    countryToDisplay = ''
  }

  return (
    <>
      <div>
        find countries <input value={newCountry} onChange={handleCountryChange}/>
        {countryToDisplay}
      </div>
    </>
  )
}

export default App