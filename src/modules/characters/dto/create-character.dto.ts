import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateCharacterDto {
  @Field()
  name: string;

  @Field()
  description: string;

  @Field({ nullable: true })
  gender?: string;

  @Field({ nullable: true })
  race?: string;

  @Field(() => [String])
  appearances: string[];
}