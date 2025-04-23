import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ZeldaApiService } from './zelda-api.service';
import { Game } from '../entities/game.entity';
import { ObjectId } from 'bson';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class GamesService {
  private readonly dataPath = path.join(process.cwd(), 'src', 'modules', 'games', 'services', 'data.json');

  constructor(
    private prisma: PrismaService,
    private zeldaApiService: ZeldaApiService,
  ) {}

  async findAll(): Promise<Game[]> {
    const result = await this.prisma.$runCommandRaw({
      find: 'games',
      projection: {
        _id: 1,  // Incluimos el _id de MongoDB
        name: 1,
        description: 1,
        developer: 1,
        publisher: 1,
        released_date: 1
      }
    });
    
    // Transformamos el _id de MongoDB a id para GraphQL
    return (result as any).cursor.firstBatch.map(game => ({
      id: game._id.toString(),  // Convertimos el ObjectId a string
      name: game.name,
      description: game.description,
      developer: game.developer,
      publisher: game.publisher,
      released_date: game.released_date
    }));
  }

  async syncGamesFromApi(): Promise<boolean> {
    try {
      // First: Fetch and save games to data.json
      await this.zeldaApiService.fetchGames();
      
      // Second: Read the data.json file
      const gamesData = JSON.parse(fs.readFileSync(this.dataPath, 'utf8'));
      
      // Third: Drop existing collection
      await this.prisma.$runCommandRaw({
        drop: 'games'
      });
      
      // Fourth: Insert all games at once using native MongoDB command
      await this.prisma.$runCommandRaw({
        insert: 'games',
        documents: gamesData.map(game => ({
          _id: new ObjectId(),
          name: game.name,
          description: game.description,
          developer: game.developer,
          publisher: game.publisher,
          released_date: game.released_date.trim()
        }))
      });

      return true;
    } catch (error) {
      console.error('Error syncing games:', error);
      throw new Error(`Failed to sync games: ${error.message}`);
    }
  }
}