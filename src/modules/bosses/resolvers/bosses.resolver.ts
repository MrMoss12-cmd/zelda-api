import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Boss } from '../entities/boss.entity';
import { BossService } from '../services/boss.service';
import { CreateBossDto } from '../dto/create-boss.dto';
import { UpdateBossDto } from '../dto/update-boss.dto';

@Resolver(() => Boss)
export class BossesResolver {
  constructor(private readonly bossService: BossService) {}

  @Query(() => [Boss], { name: 'bosses' })
  async findAll(): Promise<Boss[]> {
    return this.bossService.findAll();
  }

  @Query(() => Boss, { name: 'boss' })
  async findOne(@Args('id') id: string): Promise<Boss> {
    return this.bossService.findOne(id);
  }

  @Mutation(() => Boss, { name: 'createBoss' })
  async create(@Args('createBossInput') createBossDto: CreateBossDto): Promise<Boss> {
    return this.bossService.create(createBossDto);
  }

  @Mutation(() => Boss, { name: 'updateBoss' })
  async update(
    @Args('id') id: string,
    @Args('updateBossInput') updateBossDto: UpdateBossDto,
  ): Promise<Boss> {
    return this.bossService.update(id, updateBossDto);
  }

  @Mutation(() => Boolean, { name: 'deleteBoss' })
  async remove(@Args('id') id: string): Promise<boolean> {
    return this.bossService.remove(id);
  }

  @Mutation(() => Boolean, { name: 'syncBosses' })
  async sync(): Promise<boolean> {
    return this.bossService.syncBossesFromApi();
  }
}