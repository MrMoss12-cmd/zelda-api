import { Module } from '@nestjs/common';
import { ItemService } from './services/item.service';
import { ItemsResolver } from './resolvers/items.resolver';
import { PrismaService } from '../prisma/prisma.service';
import { ItemApiService } from './services/item-api.service';

@Module({
  providers: [ItemService, ItemsResolver, PrismaService, ItemApiService],
})
export class ItemsModule {}