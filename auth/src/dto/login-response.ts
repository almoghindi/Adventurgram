import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class LoginResponse {
  @Field()
  access_token: string;

  @Field(() => ID)
  userId: string;
}
