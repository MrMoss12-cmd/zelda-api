import { CreateItemDto } from './create-item.dto';
import { InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateItemDto extends PartialType(CreateItemDto) {}