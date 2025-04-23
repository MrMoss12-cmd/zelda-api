import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { MonsterApiService } from './monster-api.service';
import { Monster } from '../entities/monster.entity';
import { ObjectId } from 'bson';
import * as fs from 'fs';
import * as path from 'path';
import { CreateMonsterDto } from '../dto/create-monster.dto';
import { UpdateMonsterDto } from '../dto/update-monster.dto';

@Injectable()
export class MonsterService {
  private readonly dataPath = path.join(process.cwd(), 'src', 'modules', 'monsters', 'services', 'monster-data.json');

  constructor(
    private prisma: PrismaService,
    private monsterApiService: MonsterApiService,
  ) {}

  async findAll(): Promise<Monster[]> {
    const result = await this.prisma.$runCommandRaw({
      find: 'monsters',
      projection: {
        _id: 1,
        name: 1,
        description: 1,
        appearances: 1
      }
    });
    
    return (result as any).cursor.firstBatch.map(monster => ({
      id: monster._id.toString(),
      name: monster.name,
      description: monster.description,
      appearances: monster.appearances || [],
      games: [] // Added missing property
    }));
  }

  async findOne(id: string): Promise<Monster> {
    const result = await this.prisma.$runCommandRaw({
      find: 'monsters',
      filter: { _id: new ObjectId(id) },
      limit: 1
    });
    
    const monster = (result as any).cursor.firstBatch[0];
    if (!monster) throw new Error(`Monster with ID ${id} not found`);
    
    return {
      id: monster._id.toString(),
      name: monster.name,
      description: monster.description,
      appearances: monster.appearances || [],
      games: [] // Added missing property
    };
  }

  async create(createMonsterDto: CreateMonsterDto): Promise<Monster> {
    const result = await this.prisma.$runCommandRaw({
      insert: 'monsters',
      documents: [{
        _id: new ObjectId(),
        name: createMonsterDto.name,
        description: createMonsterDto.description,
        appearances: createMonsterDto.appearances
      }]
    });

    return this.findOne((result as any).insertedIds[0].toString());
  }

  async update(id: string, updateMonsterDto: UpdateMonsterDto): Promise<Monster> {
    const updateData = {
      name: updateMonsterDto.name,
      description: updateMonsterDto.description,
      appearances: updateMonsterDto.appearances
    };

    await this.prisma.$runCommandRaw({
      update: 'monsters',
      updates: [{
        q: { _id: new ObjectId(id) },
        u: { $set: updateData }
      }]
    });

    return this.findOne(id);
  }

  async syncMonstersFromApi(): Promise<boolean> {
    try {
      await this.monsterApiService.fetchMonsters();
      const monsterData = JSON.parse(fs.readFileSync(this.dataPath, 'utf8'));
      
      await this.prisma.$runCommandRaw({
        drop: 'monsters'
      });
      
      await this.prisma.$runCommandRaw({
        insert: 'monsters',
        documents: monsterData.map(monster => ({
          _id: new ObjectId(),
          name: monster.name,
          description: monster.description,
          appearances: monster.appearances
        }))
      });

      return true;
    } catch (error) {
      console.error('Error syncing monsters:', error);
      throw new Error(`Failed to sync monsters: ${error.message}`);
    }
  }

  async remove(id: string): Promise<boolean> {
    try {
      const result = await this.prisma.$runCommandRaw({
        delete: 'monsters',
        deletes: [
          {
            q: { _id: new ObjectId(id) },
            limit: 1
          }
        ]
      });

      return (result as any).deletedCount > 0;
    } catch (error) {
      console.error('Error removing monster:', error);
      throw new Error(`Failed to remove monster: ${error.message}`);
    }
  }
}