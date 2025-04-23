import { Module } from '@nestjs/common';
import { BossService } from './services/boss.service';
import { BossesResolver } from './resolvers/bosses.resolver';
import { PrismaService } from '../prisma/prisma.service';
import { BossApiService } from './services/boss-api.service';

@Module({
  providers: [BossService, BossesResolver, PrismaService, BossApiService],
})
export class BossesModule {}