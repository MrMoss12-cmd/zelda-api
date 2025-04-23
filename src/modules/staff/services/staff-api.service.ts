import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class StaffApiService {
  private readonly apiUrl = 'https://zelda.fanapis.com/api';
  private readonly dataPath = path.join(process.cwd(), 'src', 'modules', 'staff', 'services', 'staff-data.json');

  async fetchStaff() {
    try {
      const response = await axios.get(`${this.apiUrl}/staff?limit=100`);
      const staff = response.data.data;
      
      fs.writeFileSync(this.dataPath, JSON.stringify(staff, null, 2), 'utf8');
      console.log(`Staff data saved to: ${this.dataPath}`);
      
      return staff;
    } catch (error) {
      console.error('Error fetching or saving staff:', error);
      throw new Error(`Failed to fetch or save staff: ${error.message}`);
    }
  }
}