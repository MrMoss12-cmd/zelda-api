import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class BossApiService {
  private readonly apiUrl = 'https://zelda.fanapis.com/api';
  private readonly dataPath = path.join(process.cwd(), 'src', 'modules', 'bosses', 'services', 'boss-data.json');

  async fetchBosses() {
    try {
      const response = await axios.get(`${this.apiUrl}/bosses?limit=100`);
      const bosses = response.data.data;
      
      fs.writeFileSync(this.dataPath, JSON.stringify(bosses, null, 2));
      console.log('Bosses data fetched and saved successfully');
    } catch (error) {
      console.error('Error fetching bosses:', error);
      throw error;
    }
  }
}