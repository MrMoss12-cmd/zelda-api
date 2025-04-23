import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Dungeon } from '../entities/dungeon.entity';
import { DungeonService } from '../services/dungeon.service';
import { CreateDungeonDto } from '../dto/create-dungeon.dto';
import { UpdateDungeonDto } from '../dto/update-dungeon.dto';

@Resolver(() => Dungeon)
export class DungeonsResolver {
  constructor(private readonly dungeonService: DungeonService) {}

  @Query(() => [Dungeon], { name: 'dungeons' })
  async findAll(): Promise<Dungeon[]> {
    return this.dungeonService.findAll();
  }

  @Query(() => Dungeon, { name: 'dungeon' })
  async findOne(@Args('id') id: string): Promise<Dungeon> {
    return this.dungeonService.findOne(id);
  }

  @Mutation(() => Dungeon, { name: 'createDungeon' })
  async create(@Args('createDungeonInput') createDungeonDto: CreateDungeonDto): Promise<Dungeon> {
    return this.dungeonService.create(createDungeonDto);
  }

  @Mutation(() => Dungeon, { name: 'updateDungeon' })
  async update(
    @Args('id') id: string,
    @Args('updateDungeonInput') updateDungeonDto: UpdateDungeonDto,
  ): Promise<Dungeon> {
    return this.dungeonService.update(id, updateDungeonDto);
  }

  @Mutation(() => Boolean, { name: 'deleteDungeon' })
  async remove(@Args('id') id: string): Promise<boolean> {
    return this.dungeonService.remove(id);
  }

  @Mutation(() => Boolean, { name: 'syncDungeons' })
  async sync(): Promise<boolean> {
    return this.dungeonService.syncDungeonsFromApi();
  }
}