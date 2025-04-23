import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ZeldaApiService {
  private readonly apiUrl = 'https://zelda.fanapis.com/api';
  private readonly dataPath = path.join(process.cwd(), 'src', 'modules', 'games', 'services', 'data.json');

  async fetchGames() {
    try {
      const response = await axios.get(`${this.apiUrl}/games?limit=100`);
      const games = response.data.data;
      
      // Save to JSON file using synchronous write
      fs.writeFileSync(this.dataPath, JSON.stringify(games, null, 2), 'utf8');
      console.log(`Data saved to: ${this.dataPath}`);
      
      return games;
    } catch (error) {
      console.error('Error fetching or saving games:', error);
      throw new Error(`Failed to fetch or save games: ${error.message}`);
    }
  }
}