import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { BossApiService } from './boss-api.service';
import { Boss } from '../entities/boss.entity';
import { ObjectId } from 'bson';
import * as fs from 'fs';
import * as path from 'path';
import { CreateBossDto } from '../dto/create-boss.dto';
import { UpdateBossDto } from '../dto/update-boss.dto';

@Injectable()
export class BossService {
  private readonly dataPath = path.join(process.cwd(), 'src', 'modules', 'bosses', 'services', 'boss-data.json');

  constructor(
    private prisma: PrismaService,
    private bossApiService: BossApiService,
  ) {}

  async findAll(): Promise<Boss[]> {
    const result = await this.prisma.$runCommandRaw({
      find: 'bosses',
      projection: {
        _id: 1,
        name: 1,
        description: 1,
        appearances: 1,
        dungeons: 1
      }
    });
    
    return (result as any).cursor.firstBatch.map(boss => ({
      id: boss._id.toString(),
      name: boss.name,
      description: boss.description,
      appearances: boss.appearances || [],
      dungeons: boss.dungeons || [],
      games: [], // Added missing property
      dungeon: [] // Added missing property
    }));
  }

  async findOne(id: string): Promise<Boss> {
    const result = await this.prisma.$runCommandRaw({
      find: 'bosses',
      filter: { _id: new ObjectId(id) },
      limit: 1
    });
    
    const boss = (result as any).cursor.firstBatch[0];
    if (!boss) throw new Error(`Boss with ID ${id} not found`);
    
    return {
      id: boss._id.toString(),
      name: boss.name,
      description: boss.description,
      appearances: boss.appearances || [],
      dungeons: boss.dungeons || [],
      games: [], // Added missing property
      dungeon: [] // Added missing property
    };
  }

  async create(createBossDto: CreateBossDto): Promise<Boss> {
    const result = await this.prisma.$runCommandRaw({
      insert: 'bosses',
      documents: [{
        _id: new ObjectId(),
        name: createBossDto.name,
        description: createBossDto.description,
        appearances: createBossDto.appearances,
        dungeons: createBossDto.dungeons
      }]
    });

    return this.findOne((result as any).insertedIds[0].toString());
  }

  async update(id: string, updateBossDto: UpdateBossDto): Promise<Boss> {
    const updateData = {
      name: updateBossDto.name,
      description: updateBossDto.description,
      appearances: updateBossDto.appearances,
      dungeons: updateBossDto.dungeons
    };

    await this.prisma.$runCommandRaw({
      update: 'bosses',
      updates: [{
        q: { _id: new ObjectId(id) },
        u: { $set: updateData }
      }]
    });

    return this.findOne(id);
  }

  async syncBossesFromApi(): Promise<boolean> {
    try {
      await this.bossApiService.fetchBosses();
      const bossData = JSON.parse(fs.readFileSync(this.dataPath, 'utf8'));
      
      await this.prisma.$runCommandRaw({
        drop: 'bosses'
      });
      
      await this.prisma.$runCommandRaw({
        insert: 'bosses',
        documents: bossData.map(boss => ({
          _id: new ObjectId(),
          name: boss.name,
          description: boss.description,
          appearances: boss.appearances,
          dungeons: boss.dungeons
        }))
      });

      return true;
    } catch (error) {
      console.error('Error syncing bosses:', error);
      throw new Error(`Failed to sync bosses: ${error.message}`);
    }
  }

  async remove(id: string): Promise<boolean> {
    try {
      const result = await this.prisma.$runCommandRaw({
        delete: 'bosses',
        deletes: [
          {
            q: { _id: new ObjectId(id) },
            limit: 1
          }
        ]
      });

      return (result as any).deletedCount > 0;
    } catch (error) {
      console.error('Error removing boss:', error);
      throw new Error(`Failed to remove boss: ${error.message}`);
    }
  }
}