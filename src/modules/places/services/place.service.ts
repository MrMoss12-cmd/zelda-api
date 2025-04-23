import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PlaceApiService } from './place-api.service';
import { Place } from '../entities/place.entity';
import { ObjectId } from 'bson';
import * as fs from 'fs';
import * as path from 'path';
import { CreatePlaceDto } from '../dto/create-place.dto';
import { UpdatePlaceDto } from '../dto/update-place.dto';

@Injectable()
export class PlaceService {
  private readonly dataPath = path.join(process.cwd(), 'src', 'modules', 'places', 'services', 'place-data.json');

  constructor(
    private prisma: PrismaService,
    private placeApiService: PlaceApiService,
  ) {}

  async findAll(): Promise<Place[]> {
    const result = await this.prisma.$runCommandRaw({
      find: 'places',
      projection: {
        _id: 1,
        name: 1,
        description: 1,
        appearances: 1,
        inhabitants: 1
      }
    });
    
    return (result as any).cursor.firstBatch.map(place => ({
      id: place._id.toString(),
      name: place.name,
      description: place.description,
      appearances: place.appearances || [],
      inhabitants: place.inhabitants || [],
      games: [] // Added missing property
    }));
  }

  async findOne(id: string): Promise<Place> {
    const result = await this.prisma.$runCommandRaw({
      find: 'places',
      filter: { _id: new ObjectId(id) },
      limit: 1
    });
    
    const place = (result as any).cursor.firstBatch[0];
    if (!place) throw new Error(`Place with ID ${id} not found`);
    
    return {
      id: place._id.toString(),
      name: place.name,
      description: place.description,
      appearances: place.appearances || [],
      inhabitants: place.inhabitants || [],
      games: [] // Added missing property
    };
  }

  async create(createPlaceDto: CreatePlaceDto): Promise<Place> {
    const result = await this.prisma.$runCommandRaw({
      insert: 'places',
      documents: [{
        _id: new ObjectId(),
        name: createPlaceDto.name,
        description: createPlaceDto.description,
        appearances: createPlaceDto.appearances,
        region: createPlaceDto.region
      }]
    });

    return this.findOne((result as any).insertedIds[0].toString());
  }

  async update(id: string, updatePlaceDto: UpdatePlaceDto): Promise<Place> {
    const updateData = {
      name: updatePlaceDto.name,
      description: updatePlaceDto.description,
      appearances: updatePlaceDto.appearances,
      region: updatePlaceDto.region
    };

    await this.prisma.$runCommandRaw({
      update: 'places',
      updates: [{
        q: { _id: new ObjectId(id) },
        u: { $set: updateData }
      }]
    });

    return this.findOne(id);
  }

  async syncPlacesFromApi(): Promise<boolean> {
    try {
      await this.placeApiService.fetchPlaces();
      const placeData = JSON.parse(fs.readFileSync(this.dataPath, 'utf8'));
      
      await this.prisma.$runCommandRaw({
        drop: 'places'
      });
      
      await this.prisma.$runCommandRaw({
        insert: 'places',
        documents: placeData.map(place => ({
          _id: new ObjectId(),
          name: place.name,
          description: place.description,
          appearances: place.appearances,
          region: place.region
        }))
      });

      return true;
    } catch (error) {
      console.error('Error syncing places:', error);
      throw new Error(`Failed to sync places: ${error.message}`);
    }
  }

  async remove(id: string): Promise<boolean> {
    try {
      const result = await this.prisma.$runCommandRaw({
        delete: 'places',
        deletes: [
          {
            q: { _id: new ObjectId(id) },
            limit: 1
          }
        ]
      });

      return (result as any).deletedCount > 0;
    } catch (error) {
      console.error('Error removing place:', error);
      throw new Error(`Failed to remove place: ${error.message}`);
    }
  }
}