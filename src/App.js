import { Card, CardContent, FormControl, MenuItem, Select } from '@material-ui/core';
// import axios from 'axios';
import { useEffect, useState } from 'react';
import './App.css';
import { prettyPrintStat, sortData } from './helper';
import InfoBox from './InfoBox';
import MapsCom from './MapsCom';
import Table from './Table';
import LineGraph from './LineGraph';
import "leaflet/dist/leaflet.css";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide"); //set by default value in dropdown
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");


  useEffect(()=>{
     fetch("https://corona.lmao.ninja/v3/covid-19/all")
    .then((response) => response.json())
    .then((data) => {
      setCountryInfo(data)
    });
  },[])
  useEffect(() => {
    const getCountriesData = async () => {
      // const response = await axios.get("https://corona.lmao.ninja/v3/covid-19/countries");
      // const countries = response.data.map((x)=>(
      //         {
      //           name:x.country,
      //           value:x.countryInfo.iso2
      //         }));

      //         setCountries(countries)

      await fetch("https://corona.lmao.ninja/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((x) => (
            {
              name: x.country,
              value: x.countryInfo.iso2
            }));
          const sortedData = sortData(data);   //helper mmethod sort data for table
          setCountries(countries);
          setTableData(sortedData);
          setMapCountries(data);
          
        });

      // return () => {
      //   cleanup
    }
    getCountriesData()
  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    setCountry(countryCode);
    
    const url = countryCode==='worldwide'?"https://corona.lmao.ninja/v3/covid-19/all":`https://corona.lmao.ninja/v3/covid-19/countries/${countryCode}`
        await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
        countryCode === "worldwide"
        ? setMapCenter([34.80746, -40.4796])
        : setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
      });

   

  }
  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>COVID_19 TRACKER</h1>
          <FormControl className="app__dropdown">
            <Select variant="outlined" value={country} onChange={onCountryChange}>
              <MenuItem value="worldwide">World Wide</MenuItem>
              {
                countries.map(x => (
                  <MenuItem  value={x.value}>{x.name}</MenuItem>
                ))
              }
            </Select>
          </FormControl>
        </div>

        <div className="app__stats">
          <InfoBox onClick={(e)=>setCasesType("cases")} active={casesType==="cases"} isRed title="Corona Virus Cases" cases={prettyPrintStat(countryInfo.todayCases)} total={prettyPrintStat(countryInfo.cases)} />
          <InfoBox onClick={(e)=>setCasesType("recovered")} active={casesType==="recovered"} title="Recovered" cases={prettyPrintStat(countryInfo.todayRecovered)} total={prettyPrintStat(countryInfo.recovered)} />
          <InfoBox onClick={(e)=>setCasesType("deaths")} active={casesType==="deaths"} isRed title="Deaths" cases={prettyPrintStat(countryInfo.todayDeaths)} total={prettyPrintStat(countryInfo.deaths)} />
        </div>

        <MapsCom countries={mapCountries}center={mapCenter} zoom={mapZoom} casesType={casesType} />
      </div>

      <Card className="app__right">
        <CardContent>
          <h3>Live Cases by country</h3>
          <Table countries={tableData}/>
          <h3 className="app__graphTitle">Worldwide new {casesType} </h3>
          <LineGraph className="app__graph" casesType={casesType}/>
        </CardContent>
      </Card>

    </div>
  );
}

export default App;
