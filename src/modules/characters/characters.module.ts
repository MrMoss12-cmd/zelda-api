import { Module } from '@nestjs/common';
import { CharacterService } from './services/character.service';
import { CharactersResolver } from './resolvers/characters.resolver';
import { PrismaService } from '../prisma/prisma.service';
import { CharacterApiService } from './services/character-api.service';

@Module({
  providers: [CharacterService, CharactersResolver, PrismaService, CharacterApiService],
})
export class CharactersModule {}