import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { MonstersModule } from './modules/monsters/monsters.module';
import { PlacesModule } from './modules/places/places.module';
import { StaffModule } from './modules/staff/staff.module';
import { GamesModule } from './modules/games/games.module';
import { ItemsModule } from './modules/items/items.module';
import { DungeonsModule } from './modules/dungeons/dungeons.module';
import { CharactersModule } from './modules/characters/characters.module';
import { BossesModule } from './modules/bosses/bosses.module'; // Add this import

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
    }),
    MonstersModule,
    PlacesModule,
    StaffModule,
    GamesModule,
    ItemsModule,
    DungeonsModule,
    CharactersModule,
    BossesModule, // Add this module
  ],
})
export class AppModule {}
