import { CreateMonsterDto } from './create-monster.dto';
import { InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateMonsterDto extends PartialType(CreateMonsterDto) {}