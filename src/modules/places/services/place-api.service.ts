import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class PlaceApiService {
  private readonly apiUrl = 'https://zelda.fanapis.com/api';
  private readonly dataPath = path.join(process.cwd(), 'src', 'modules', 'places', 'services', 'place-data.json');

  async fetchPlaces() {
    try {
      const response = await axios.get(`${this.apiUrl}/places?limit=100`);
      const places = response.data.data;
      
      fs.writeFileSync(this.dataPath, JSON.stringify(places, null, 2));
      console.log('Places data fetched and saved successfully');
    } catch (error) {
      console.error('Error fetching places:', error);
      throw error;
    }
  }
}