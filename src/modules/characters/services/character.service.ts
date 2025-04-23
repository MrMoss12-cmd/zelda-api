import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CharacterApiService } from './character-api.service';
import { Character } from '../entities/character.entity';
import { ObjectId } from 'bson';
import * as fs from 'fs';
import * as path from 'path';
import { CreateCharacterDto } from '../dto/create-character.dto';
import { UpdateCharacterDto } from '../dto/update-character.dto';

@Injectable()
export class CharacterService {
  private readonly dataPath = path.join(process.cwd(), 'src', 'modules', 'characters', 'services', 'character-data.json');

  constructor(
    private prisma: PrismaService,
    private characterApiService: CharacterApiService,
  ) {}

  async findAll(): Promise<Character[]> {
    const result = await this.prisma.$runCommandRaw({
      find: 'characters',
      projection: {
        _id: 1,
        name: 1,
        description: 1,
        gender: 1,
        race: 1,
        appearances: 1,
        inhabitants: 1
      }
    });
    
    return (result as any).cursor.firstBatch.map(character => ({
      id: character._id.toString(),
      name: character.name,
      description: character.description,
      gender: character.gender,
      race: character.race,
      appearances: character.appearances || [],
      inhabitants: character.inhabitants || [],
      games: [], // Added missing property
      places: [] // Added missing property
    }));
  }

  async findOne(id: string): Promise<Character> {
    const result = await this.prisma.$runCommandRaw({
      find: 'characters',
      filter: { _id: new ObjectId(id) },
      limit: 1
    });
    
    const character = (result as any).cursor.firstBatch[0];
    if (!character) throw new Error(`Character with ID ${id} not found`);
    
    return {
      id: character._id.toString(),
      name: character.name,
      description: character.description,
      gender: character.gender,
      race: character.race,
      appearances: character.appearances || [],
      inhabitants: character.inhabitants || [],
      games: [], // Added missing property
      places: [] // Added missing property
    };
  }

  async create(createCharacterDto: CreateCharacterDto): Promise<Character> {
    const result = await this.prisma.$runCommandRaw({
      insert: 'characters',
      documents: [{
        _id: new ObjectId(),
        name: createCharacterDto.name,
        description: createCharacterDto.description,
        gender: createCharacterDto.gender,
        race: createCharacterDto.race,
        appearances: createCharacterDto.appearances
      }]
    });

    return this.findOne((result as any).insertedIds[0].toString());
  }

  async update(id: string, updateCharacterDto: UpdateCharacterDto): Promise<Character> {
    const updateData = {
      name: updateCharacterDto.name,
      description: updateCharacterDto.description,
      gender: updateCharacterDto.gender,
      race: updateCharacterDto.race,
      appearances: updateCharacterDto.appearances
    };

    await this.prisma.$runCommandRaw({
      update: 'characters',
      updates: [{
        q: { _id: new ObjectId(id) },
        u: { $set: updateData }
      }]
    });

    return this.findOne(id);
  }

  async syncCharactersFromApi(): Promise<boolean> {
    try {
      await this.characterApiService.fetchCharacters();
      const characterData = JSON.parse(fs.readFileSync(this.dataPath, 'utf8'));
      
      await this.prisma.$runCommandRaw({
        drop: 'characters'
      });
      
      await this.prisma.$runCommandRaw({
        insert: 'characters',
        documents: characterData.map(character => ({
          _id: new ObjectId(),
          name: character.name,
          description: character.description,
          gender: character.gender,
          race: character.race,
          appearances: character.appearances
        }))
      });

      return true;
    } catch (error) {
      console.error('Error syncing characters:', error);
      throw new Error(`Failed to sync characters: ${error.message}`);
    }
  }

  async remove(id: string): Promise<boolean> {
    try {
      const result = await this.prisma.$runCommandRaw({
        delete: 'characters',
        deletes: [
          {
            q: { _id: new ObjectId(id) },
            limit: 1
          }
        ]
      });

      return (result as any).deletedCount > 0;
    } catch (error) {
      console.error('Error removing character:', error);
      throw new Error(`Failed to remove character: ${error.message}`);
    }
  }
}