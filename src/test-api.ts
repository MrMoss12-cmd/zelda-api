import axios from 'axios';

async function testZeldaApi() {
  try {
    const apiUrl = 'https://zelda.fanapis.com/api';
    const response = await axios.get(`${apiUrl}/games?limit=100`);
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testZeldaApi();