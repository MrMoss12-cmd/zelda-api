import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class CharacterApiService {
  private readonly apiUrl = 'https://zelda.fanapis.com/api';
  private readonly dataPath = path.join(process.cwd(), 'src', 'modules', 'characters', 'services', 'character-data.json');

  async fetchCharacters() {
    try {
      const response = await axios.get(`${this.apiUrl}/characters?limit=100`);
      const characters = response.data.data;
      
      fs.writeFileSync(this.dataPath, JSON.stringify(characters, null, 2));
      console.log('Characters data fetched and saved successfully');
    } catch (error) {
      console.error('Error fetching characters:', error);
      throw error;
    }
  }
}