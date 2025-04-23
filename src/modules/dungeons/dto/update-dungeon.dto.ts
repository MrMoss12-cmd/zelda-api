import { CreateDungeonDto } from './create-dungeon.dto';
import { InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateDungeonDto extends PartialType(CreateDungeonDto) {}