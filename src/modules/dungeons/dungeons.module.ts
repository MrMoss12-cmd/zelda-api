import { Module } from '@nestjs/common';
import { DungeonService } from './services/dungeon.service';
import { DungeonsResolver } from './resolvers/dungeons.resolver';
import { PrismaService } from '../prisma/prisma.service';
import { DungeonApiService } from './services/dungeon-api.service';

@Module({
  providers: [DungeonService, DungeonsResolver, PrismaService, DungeonApiService],
})
export class DungeonsModule {}