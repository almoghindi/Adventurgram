import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class JwtPayload {
  @Field(() => ID)
  userId: string;

  @Field()
  email: string;
}
