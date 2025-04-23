import { Module } from '@nestjs/common';
import { MonsterService } from './services/monster.service';
import { MonstersResolver } from './resolvers/monsters.resolver';
import { PrismaService } from '../prisma/prisma.service';
import { MonsterApiService } from './services/monster-api.service';

@Module({
  providers: [MonsterService, MonstersResolver, PrismaService, MonsterApiService],
})
export class MonstersModule {}