import React, { useState, useEffect } from 'react';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Link } from 'react-router-dom';

interface City {
  name: string;
  country: string;
  timezone: string;
  population: number;
}

const CityTable: React.FC = () => {
  const [cities, setCities] = useState<City[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchCities();
  }, [page]);

  const fetchCities = async () => {
    const response = await axios.get(
      `https://public.opendatasoft.com/api/records/1.0/search/?dataset=geonames-all-cities-with-a-population-1000&q=${search}&rows=20&start=${page * 20}`
    );
    const newCities = response.data.records.map((record: any) => ({
      name: record.fields.name,
      country: record.fields.country,
      timezone: record.fields.timezone,
      population: record.fields.population,
    }));
    setCities((prevCities) => [...prevCities, ...newCities]);
    setHasMore(newCities.length > 0);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(0);
    setCities([]);
    fetchCities();
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search City..."
        value={search}
        onChange={handleSearch}
      />
      <InfiniteScroll
        dataLength={cities.length}
        next={() => setPage(page + 1)}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
      >
        <table>
          <thead>
            <tr>
              <th>City Name</th>
              <th>Country</th>
              <th>Timezone</th>
              <th>Population</th>
            </tr>
          </thead>
          <tbody>
            {cities.map((city, index) => (
              <tr key={index}>
                <td>
                  <Link to={`/weather/${city.name}`}>{city.name}</Link>
                </td>
                <td>{city.country}</td>
                <td>{city.timezone}</td>
                <td>{city.population}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </InfiniteScroll>
    </div>
  );
};

export default CityTable;
