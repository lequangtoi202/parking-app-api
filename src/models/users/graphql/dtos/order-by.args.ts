import { Field, InputType, PartialType } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';
import { RestrictProperties } from 'src/common/dtos/common.input';

@InputType()
export class UserOrderByWithRelationInputStrict
  implements
    Omit<
      RestrictProperties<
        UserOrderByWithRelationInputStrict,
        Prisma.UserOrderByWithRelationInput
      >,
      'Credentials' | 'AuthProvider' | 'Admin'
    >
{
  @Field(() => Prisma.SortOrder)
  createdAt: Prisma.SortOrder;
  @Field(() => Prisma.SortOrder)
  name: Prisma.SortOrder;
  @Field(() => Prisma.SortOrder)
  uid: Prisma.SortOrder;
  @Field(() => Prisma.SortOrder)
  updatedAt: Prisma.SortOrder;
}

@InputType()
export class UserOrderByWithRelationInput extends PartialType(
  UserOrderByWithRelationInputStrict,
) {}

@InputType()
export class UserOrderByRelationAggregateInput {
  @Field(() => Prisma.SortOrder)
  _count?: Prisma.SortOrder;
}
