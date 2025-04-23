import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ItemApiService } from './item-api.service';
import { Item } from '../entities/item.entity';
import { ObjectId } from 'bson';
import * as fs from 'fs';
import * as path from 'path';
import { CreateItemDto } from '../dto/create-item.dto';
import { UpdateItemDto } from '../dto/update-item.dto';

@Injectable()
export class ItemService {
  private readonly dataPath = path.join(process.cwd(), 'src', 'modules', 'items', 'services', 'item-data.json');

  constructor(
    private prisma: PrismaService,
    private itemApiService: ItemApiService,
  ) {}

  async findAll(): Promise<Item[]> {
    const result = await this.prisma.$runCommandRaw({
      find: 'items',
      projection: {
        _id: 1,
        name: 1,
        description: 1,
        games: 1
      }
    });
    
    return (result as any).cursor.firstBatch.map(item => ({
      id: item._id.toString(),
      name: item.name,
      description: item.description,
      games_ids: item.games || [],
      games: [] // Added missing property
    }));
  }

  async findOne(id: string): Promise<Item> {
    const result = await this.prisma.$runCommandRaw({
      find: 'items',
      filter: { _id: new ObjectId(id) },
      limit: 1
    });
    
    const item = (result as any).cursor.firstBatch[0];
    if (!item) throw new Error(`Item with ID ${id} not found`);
    
    return {
      id: item._id.toString(),
      name: item.name,
      description: item.description,
      games_ids: item.games || [],
      games: [] // Added missing property
    };
  }

  async create(createItemDto: CreateItemDto): Promise<Item> {
    const result = await this.prisma.$runCommandRaw({
      insert: 'items',
      documents: [{
        _id: new ObjectId(),
        name: createItemDto.name,
        description: createItemDto.description,
        games: createItemDto.games_ids
      }]
    });

    return this.findOne((result as any).insertedIds[0].toString());
  }

  async update(id: string, updateItemDto: UpdateItemDto): Promise<Item> {
    const updateData = {
      name: updateItemDto.name,
      description: updateItemDto.description,
      games: updateItemDto.games_ids
    };

    await this.prisma.$runCommandRaw({
      update: 'items',
      updates: [{
        q: { _id: new ObjectId(id) },
        u: { $set: updateData }
      }]
    });

    return this.findOne(id);
  }

  async syncItemsFromApi(): Promise<boolean> {
    try {
      await this.itemApiService.fetchItems();
      const itemData = JSON.parse(fs.readFileSync(this.dataPath, 'utf8'));
      
      await this.prisma.$runCommandRaw({
        drop: 'items'
      });
      
      await this.prisma.$runCommandRaw({
        insert: 'items',
        documents: itemData.map(item => ({
          _id: new ObjectId(),
          name: item.name,
          description: item.description,
          games: item.games || []
        }))
      });

      return true;
    } catch (error) {
      console.error('Error syncing items:', error);
      throw new Error(`Failed to sync items: ${error.message}`);
    }
  }

  async remove(id: string): Promise<boolean> {
    try {
      const result = await this.prisma.$runCommandRaw({
        delete: 'items',
        deletes: [
          {
            q: { _id: new ObjectId(id) },
            limit: 1
          }
        ]
      });

      return (result as any).deletedCount > 0;
    } catch (error) {
      console.error('Error removing item:', error);
      throw new Error(`Failed to remove item: ${error.message}`);
    }
  }
}