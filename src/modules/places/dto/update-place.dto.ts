import { CreatePlaceDto } from './create-place.dto';
import { InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdatePlaceDto extends PartialType(CreatePlaceDto) {}