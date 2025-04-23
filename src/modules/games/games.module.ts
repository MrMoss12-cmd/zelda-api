import { Module } from '@nestjs/common';
import { GamesService } from './services/games.service';
import { GamesResolver } from './resolvers/games.resolver';
import { PrismaService } from './prisma/prisma.service';
import { ZeldaApiService } from './services/zelda-api.service';

@Module({
  providers: [GamesService, GamesResolver, PrismaService, ZeldaApiService],
})
export class GamesModule {}