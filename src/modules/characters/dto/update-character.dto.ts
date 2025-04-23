import { CreateCharacterDto } from './create-character.dto';
import { InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateCharacterDto extends PartialType(CreateCharacterDto) {}