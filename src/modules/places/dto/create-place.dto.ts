import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreatePlaceDto {
  @Field()
  name: string;

  @Field()
  description: string;

  @Field(() => [String])
  appearances: string[];

  @Field({ nullable: true })
  region?: string;
}