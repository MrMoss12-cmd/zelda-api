import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Monster } from '../entities/monster.entity';
import { MonsterService } from '../services/monster.service';
import { CreateMonsterDto } from '../dto/create-monster.dto';
import { UpdateMonsterDto } from '../dto/update-monster.dto';

@Resolver(() => Monster)
export class MonstersResolver {
  constructor(private readonly monsterService: MonsterService) {}

  @Query(() => [Monster], { name: 'monsters' })
  async findAll(): Promise<Monster[]> {
    return this.monsterService.findAll();
  }

  @Query(() => Monster, { name: 'monster' })
  async findOne(@Args('id') id: string): Promise<Monster> {
    return this.monsterService.findOne(id);
  }

  @Mutation(() => Monster, { name: 'createMonster' })
  async create(@Args('createMonsterInput') createMonsterDto: CreateMonsterDto): Promise<Monster> {
    return this.monsterService.create(createMonsterDto);
  }

  @Mutation(() => Monster, { name: 'updateMonster' })
  async update(
    @Args('id') id: string,
    @Args('updateMonsterInput') updateMonsterDto: UpdateMonsterDto,
  ): Promise<Monster> {
    return this.monsterService.update(id, updateMonsterDto);
  }

  @Mutation(() => Boolean, { name: 'deleteMonster' })
  async remove(@Args('id') id: string): Promise<boolean> {
    return this.monsterService.remove(id);
  }

  @Mutation(() => Boolean, { name: 'syncMonsters' }) // Fixed typo in mutation name
  async sync(): Promise<boolean> {
    return this.monsterService.syncMonstersFromApi();
  }
}