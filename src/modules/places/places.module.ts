import { Module } from '@nestjs/common';
import { PlaceService } from './services/place.service';
import { PlacesResolver } from './resolvers/places.resolver';
import { PrismaService } from '../prisma/prisma.service';
import { PlaceApiService } from './services/place-api.service';

@Module({
  providers: [PlaceService, PlacesResolver, PrismaService, PlaceApiService],
})
export class PlacesModule {}