import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsString, Length } from 'class-validator';

@InputType()
export class UserInput {
  @Field()
  @IsEmail({}, { message: 'Email must be valid' })
  email: string;

  @Field()
  @IsString()
  @Length(4, 20, { message: 'Password must be between 4 and 20 characters' })
  password: string;
}
