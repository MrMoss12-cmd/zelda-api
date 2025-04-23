import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class MonsterApiService {
  private readonly apiUrl = 'https://zelda.fanapis.com/api';
  private readonly dataPath = path.join(process.cwd(), 'src', 'modules', 'monsters', 'services', 'monster-data.json');

  async fetchMonsters() {
    try {
      const response = await axios.get(`${this.apiUrl}/monsters?limit=100`);
      const monsters = response.data.data;
      
      fs.writeFileSync(this.dataPath, JSON.stringify(monsters, null, 2));
      console.log('Monsters data fetched and saved successfully');
    } catch (error) {
      console.error('Error fetching monsters:', error);
      throw error;
    }
  }
}