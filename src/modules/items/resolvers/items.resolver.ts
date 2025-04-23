import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Item } from '../entities/item.entity';
import { ItemService } from '../services/item.service';
import { CreateItemDto } from '../dto/create-item.dto';
import { UpdateItemDto } from '../dto/update-item.dto';

@Resolver(() => Item)
export class ItemsResolver {
  constructor(private readonly itemService: ItemService) {}

  @Query(() => [Item], { name: 'items' })
  async findAll(): Promise<Item[]> {
    return this.itemService.findAll();
  }

  @Query(() => Item, { name: 'item' })
  async findOne(@Args('id') id: string): Promise<Item> {
    return this.itemService.findOne(id);
  }

  @Mutation(() => Item, { name: 'createItem' })
  async create(@Args('createItemInput') createItemDto: CreateItemDto): Promise<Item> {
    return this.itemService.create(createItemDto);
  }

  @Mutation(() => Item, { name: 'updateItem' })
  async update(
    @Args('id') id: string,
    @Args('updateItemInput') updateItemDto: UpdateItemDto,
  ): Promise<Item> {
    return this.itemService.update(id, updateItemDto);
  }

  @Mutation(() => Boolean, { name: 'deleteItem' })
  async remove(@Args('id') id: string): Promise<boolean> {
    return this.itemService.remove(id);
  }

  @Mutation(() => Boolean, { name: 'syncItems' })
  async sync(): Promise<boolean> {
    return this.itemService.syncItemsFromApi();
  }
}