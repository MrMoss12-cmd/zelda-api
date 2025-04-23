import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Character } from '../entities/character.entity';
import { CharacterService } from '../services/character.service';
import { CreateCharacterDto } from '../dto/create-character.dto';
import { UpdateCharacterDto } from '../dto/update-character.dto';

@Resolver(() => Character)
export class CharactersResolver {
  constructor(private readonly characterService: CharacterService) {}

  @Query(() => [Character], { name: 'characters' })
  async findAll(): Promise<Character[]> {
    return this.characterService.findAll();
  }

  @Query(() => Character, { name: 'character' })
  async findOne(@Args('id') id: string): Promise<Character> {
    return this.characterService.findOne(id);
  }

  @Mutation(() => Character, { name: 'createCharacter' })
  async create(@Args('createCharacterInput') createCharacterDto: CreateCharacterDto): Promise<Character> {
    return this.characterService.create(createCharacterDto);
  }

  @Mutation(() => Character, { name: 'updateCharacter' })
  async update(
    @Args('id') id: string,
    @Args('updateCharacterInput') updateCharacterDto: UpdateCharacterDto,
  ): Promise<Character> {
    return this.characterService.update(id, updateCharacterDto);
  }

  @Mutation(() => Boolean, { name: 'deleteCharacter' })
  async remove(@Args('id') id: string): Promise<boolean> {
    return this.characterService.remove(id);
  }

  @Mutation(() => Boolean, { name: 'syncCharacters' })
  async sync(): Promise<boolean> {
    return this.characterService.syncCharactersFromApi();
  }
}