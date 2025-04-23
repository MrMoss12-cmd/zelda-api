import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Place } from '../entities/place.entity';
import { PlaceService } from '../services/place.service';
import { CreatePlaceDto } from '../dto/create-place.dto';
import { UpdatePlaceDto } from '../dto/update-place.dto';

@Resolver(() => Place)
export class PlacesResolver {
  constructor(private readonly placeService: PlaceService) {}

  @Query(() => [Place], { name: 'places' })
  async findAll(): Promise<Place[]> {
    return this.placeService.findAll();
  }

  @Query(() => Place, { name: 'place' })
  async findOne(@Args('id') id: string): Promise<Place> {
    return this.placeService.findOne(id);
  }

  @Mutation(() => Place, { name: 'createPlace' })
  async create(
    @Args('createPlaceInput', { type: () => CreatePlaceDto })
    createPlaceDto: CreatePlaceDto
  ): Promise<Place> {
    return this.placeService.create(createPlaceDto);
  }

  @Mutation(() => Place, { name: 'updatePlace' })
  async update(
    @Args('id') id: string,
    @Args('updatePlaceInput', { type: () => UpdatePlaceDto })
    updatePlaceDto: UpdatePlaceDto
  ): Promise<Place> {
    return this.placeService.update(id, updatePlaceDto);
  }

  @Mutation(() => Boolean, { name: 'deletePlace' })
  async remove(@Args('id') id: string): Promise<boolean> {
    return this.placeService.remove(id);
  }

  @Mutation(() => Boolean, { name: 'syncPlaces' })
  async sync(): Promise<boolean> {
    return this.placeService.syncPlacesFromApi();
  }
}