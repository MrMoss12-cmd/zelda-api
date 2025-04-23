import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { DungeonApiService } from './dungeon-api.service';
import { Dungeon } from '../entities/dungeon.entity';
import { ObjectId } from 'bson';
import * as fs from 'fs';
import * as path from 'path';
import { CreateDungeonDto } from '../dto/create-dungeon.dto';
import { UpdateDungeonDto } from '../dto/update-dungeon.dto';

@Injectable()
export class DungeonService {
  private readonly dataPath = path.join(process.cwd(), 'src', 'modules', 'dungeons', 'services', 'dungeon-data.json');

  constructor(
    private prisma: PrismaService,
    private dungeonApiService: DungeonApiService,
  ) {}

  async findAll(): Promise<Dungeon[]> {
    const result = await this.prisma.$runCommandRaw({
      find: 'dungeons',
      projection: {
        _id: 1,
        name: 1,
        description: 1,
        appearances: 1,
        boss_ids: 1
      }
    });
    
    return (result as any).cursor.firstBatch.map(dungeon => ({
      id: dungeon._id.toString(),
      name: dungeon.name,
      description: dungeon.description,
      appearances: dungeon.appearances || [],
      boss_ids: dungeon.boss_ids || [],
      games: [],
      bosses: []
    }));
  }

  async findOne(id: string): Promise<Dungeon> {
    const result = await this.prisma.$runCommandRaw({
      find: 'dungeons',
      filter: { _id: new ObjectId(id) },
      limit: 1
    });
    
    const dungeon = (result as any).cursor.firstBatch[0];
    if (!dungeon) throw new Error(`Dungeon with ID ${id} not found`);
    
    return {
      id: dungeon._id.toString(),
      name: dungeon.name,
      description: dungeon.description,
      appearances: dungeon.appearances || [],
      boss_ids: dungeon.boss_ids || [],
      games: [],
      bosses: []
    };
  }

  async create(createDungeonDto: CreateDungeonDto): Promise<Dungeon> {
    const result = await this.prisma.$runCommandRaw({
      insert: 'dungeons',
      documents: [{
        _id: new ObjectId(),
        name: createDungeonDto.name,
        description: createDungeonDto.description,
        appearances: createDungeonDto.appearances,
        boss_ids: []
      }]
    });

    return this.findOne((result as any).insertedIds[0].toString());
  }

  async update(id: string, updateDungeonDto: UpdateDungeonDto): Promise<Dungeon> {
    const updateData = {
      name: updateDungeonDto.name,
      description: updateDungeonDto.description,
      appearances: updateDungeonDto.appearances
    };

    await this.prisma.$runCommandRaw({
      update: 'dungeons',
      updates: [{
        q: { _id: new ObjectId(id) },
        u: { $set: updateData }
      }]
    });

    return this.findOne(id);
  }

  async syncDungeonsFromApi(): Promise<boolean> {
    try {
      await this.dungeonApiService.fetchDungeons();
      const dungeonData = JSON.parse(fs.readFileSync(this.dataPath, 'utf8'));
      
      await this.prisma.$runCommandRaw({
        drop: 'dungeons'
      });
      
      await this.prisma.$runCommandRaw({
        insert: 'dungeons',
        documents: dungeonData.map(dungeon => ({
          _id: new ObjectId(),
          name: dungeon.name,
          description: dungeon.description,
          appearances: dungeon.appearances || [],
          boss_ids: dungeon.boss_ids || []
        }))
      });

      return true;
    } catch (error) {
      console.error('Error syncing dungeons:', error);
      throw new Error(`Failed to sync dungeons: ${error.message}`);
    }
  }

  async remove(id: string): Promise<boolean> {
    try {
      const result = await this.prisma.$runCommandRaw({
        delete: 'dungeons',
        deletes: [
          {
            q: { _id: new ObjectId(id) },
            limit: 1
          }
        ]
      });

      return (result as any).deletedCount > 0;
    } catch (error) {
      console.error('Error removing dungeon:', error);
      throw new Error(`Failed to remove dungeon: ${error.message}`);
    }
  }
}