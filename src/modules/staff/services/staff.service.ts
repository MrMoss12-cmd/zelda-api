import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Staff } from '../entities/staff.entity';
import { ObjectId } from 'bson';
import { CreateStaffDto } from '../dto/create-staff.dto';
import { UpdateStaffDto } from '../dto/update-staff.dto';
import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';

@Injectable()
export class StaffService {
  private readonly dataPath = path.join(process.cwd(), 'src', 'modules', 'staff', 'services', 'staff-data.json');
  private readonly apiUrl = 'https://zelda.fanapis.com/api/staff';
  
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Staff[]> {
    const result = await this.prisma.$runCommandRaw({
      find: 'staff',
      projection: {
        _id: 1,
        name: 1,
        worked_on: 1,
        image_url: 1
      }
    });

    const staffMembers = (result as any).cursor.firstBatch;
    
    // For each staff member, fetch their games
    const staffWithGames = await Promise.all(
      staffMembers.map(async (staff) => {
        const games = await Promise.all(
          (staff.worked_on || []).map(async (gameId) => {
            try {
              // Ensure gameId is a valid ObjectId
              const objectId = typeof gameId === 'string' ? new ObjectId(gameId) : gameId;
              
              const gameResult = await this.prisma.$runCommandRaw({
                find: 'games',
                filter: { _id: objectId },
                limit: 1
              });
              
              const game = (gameResult as any).cursor.firstBatch[0];
              return game ? {
                id: game._id.toString(),
                name: game.name,
                description: game.description,
                developer: game.developer,
                publisher: game.publisher,
                released_date: game.released_date,
                image_url: game.image_url,
                createdAt: game.createdAt,
                updatedAt: game.updatedAt
              } : null;
            } catch (error) {
              console.error(`Invalid game ID: ${gameId}`, error);
              return null;
            }
          })
        );

        return {
          id: staff._id.toString(),
          name: staff.name,
          worked_on: games.filter(game => game !== null),
          image_url: staff.image_url
        };
      })
    );

    return staffWithGames;
  }

  async findOne(id: string): Promise<Staff> {
    const result = await this.prisma.$runCommandRaw({
      find: 'staff',
      filter: { _id: new ObjectId(id) },
      limit: 1
    });
    
    const staff = (result as any).cursor.firstBatch[0];
    if (!staff) throw new Error(`Staff with ID ${id} not found`);

    const games = await Promise.all(
      staff.worked_on.map(async (gameId) => {
        const gameResult = await this.prisma.$runCommandRaw({
          find: 'games',
          filter: { _id: new ObjectId(gameId) },
          limit: 1
        });
        const game = (gameResult as any).cursor.firstBatch[0];
        return game ? {
          id: game._id.toString(),
          name: game.name,
          description: game.description,
          developer: game.developer,
          publisher: game.publisher,
          released_date: game.released_date,
          image_url: game.image_url
        } : null;
      })
    );

    return {
      id: staff._id.toString(),
      name: staff.name,
      worked_on: games.filter(game => game !== null),
      image_url: staff.image_url
    };
  }

  async create(createStaffDto: CreateStaffDto): Promise<Staff> {
    const result = await this.prisma.$runCommandRaw({
      insert: 'staff',
      documents: [{
        _id: new ObjectId(),
        name: createStaffDto.name,
        worked_on: createStaffDto.worked_on.map(id => new ObjectId(id)),
        image_url: createStaffDto.image_url // Changed from imageUrl to image_url
      }]
    });

    return this.findOne((result as any).insertedIds[0].toString());
  }

  async update(id: string, updateStaffDto: UpdateStaffDto): Promise<Staff> {
    const updateData = {
      name: updateStaffDto.name,
      worked_on: updateStaffDto.worked_on?.map(id => new ObjectId(id)),
      image_url: updateStaffDto.image_url // Changed from imageUrl to image_url
    };

    await this.prisma.$runCommandRaw({
      update: 'staff',
      updates: [{
        q: { _id: new ObjectId(id) },
        u: { $set: updateData }
      }]
    });

    return this.findOne(id);
  }

  async remove(id: string): Promise<boolean> {
    try {
      const result = await this.prisma.$runCommandRaw({
        delete: 'staff',
        deletes: [
          {
            q: { _id: new ObjectId(id) },
            limit: 1
          }
        ]
      });

      return (result as any).deletedCount > 0;
    } catch (error) {
      console.error('Error removing staff:', error);
      throw new Error(`Failed to remove staff: ${error.message}`);
    }
  }

  async syncStaffFromApi(): Promise<boolean> {
    try {
      const response = await axios.get(`${this.apiUrl}?limit=100`);
      const staffData = response.data.data;
      
      // Get all games first
      const gamesResult = await this.prisma.$runCommandRaw({
        find: 'games',
        projection: { _id: 1, name: 1 }
      });
      const games = (gamesResult as any).cursor.firstBatch;
      
      // Drop existing collection
      await this.prisma.$runCommandRaw({
        drop: 'staff'
      });
      
      // Insert new data
      await this.prisma.$runCommandRaw({
        insert: 'staff',
        documents: staffData.map(staff => {
          // Extract game IDs from the API URLs
          const gameNames = (staff.worked_on || []).map(url => {
            const parts = url.split('/');
            return parts[parts.length - 1];
          });
          
          // Find matching game IDs from our database
          const matchedGameIds = games
            .filter(game => gameNames.includes(game.name))
            .map(game => game._id);

          return {
            _id: new ObjectId(),
            name: staff.name,
            worked_on: matchedGameIds,
            image_url: staff.image_url || null
          };
        })
      });

      // Save the raw data for reference
      fs.writeFileSync(this.dataPath, JSON.stringify(staffData, null, 2));

      return true;
    } catch (error) {
      console.error('Error syncing staff:', error);
      throw new Error(`Failed to sync staff: ${error.message}`);
    }
  }
}