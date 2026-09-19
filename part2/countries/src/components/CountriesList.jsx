const CountriesList = ({ countries, handleCountryShow }) => {
    console.log('rendering countries list')

    return (
        <>
            {countries.map(country => 
                <div key={country}>
                    {country}
                    <button onClick={() => handleCountryShow(country)}>show</button>
                </div>
            )}
        </>
    )
}

export default CountriesList