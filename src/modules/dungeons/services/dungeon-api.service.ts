import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class DungeonApiService {
  private readonly apiUrl = 'https://zelda.fanapis.com/api';
  private readonly dataPath = path.join(process.cwd(), 'src', 'modules', 'dungeons', 'services', 'dungeon-data.json');

  async fetchDungeons() {
    try {
      const response = await axios.get(`${this.apiUrl}/dungeons?limit=100`);
      const dungeons = response.data.data;
      
      fs.writeFileSync(this.dataPath, JSON.stringify(dungeons, null, 2));
      console.log('Dungeons data fetched and saved successfully');
    } catch (error) {
      console.error('Error fetching dungeons:', error);
      throw error;
    }
  }
}