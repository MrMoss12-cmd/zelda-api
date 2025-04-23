import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateMonsterDto {
  @Field()
  name: string;

  @Field()
  description: string;

  @Field(() => [String])
  appearances: string[];
}