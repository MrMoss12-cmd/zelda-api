import { CreateBossDto } from './create-boss.dto';
import { InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateBossDto extends PartialType(CreateBossDto) {}