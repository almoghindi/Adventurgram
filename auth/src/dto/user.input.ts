import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsPhoneNumber, MinLength } from 'class-validator';

@InputType()
export class UserInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @Field()
  @IsPhoneNumber('IL')
  phone: string;
}
