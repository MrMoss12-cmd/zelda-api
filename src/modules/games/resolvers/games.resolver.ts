import { Resolver, Query, Mutation } from '@nestjs/graphql';
import { Game } from '../entities/game.entity';
import { GamesService } from '../services/games.service';

@Resolver(() => Game)
export class GamesResolver {
  constructor(private readonly gamesService: GamesService) {}

  @Query(() => [Game])
  async games(): Promise<Game[]> {
    return this.gamesService.findAll();
  }

  @Mutation(() => Boolean)
  async syncGames(): Promise<boolean> {
    return this.gamesService.syncGamesFromApi();
  }
}