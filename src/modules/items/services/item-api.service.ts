import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ItemApiService {
  private readonly apiUrl = 'https://zelda.fanapis.com/api';
  private readonly dataPath = path.join(process.cwd(), 'src', 'modules', 'items', 'services', 'item-data.json');

  async fetchItems() {
    try {
      const response = await axios.get(`${this.apiUrl}/items?limit=100`);
      const items = response.data.data;
      
      fs.writeFileSync(this.dataPath, JSON.stringify(items, null, 2));
      console.log('Items data fetched and saved successfully');
    } catch (error) {
      console.error('Error fetching items:', error);
      throw error;
    }
  }
}