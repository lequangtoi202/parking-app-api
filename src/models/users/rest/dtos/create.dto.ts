import { UserEntity } from '../entity/user.entity';
import { PickType } from '@nestjs/swagger';

export class CreateUser extends PickType(UserEntity, ['name', 'uid']) {}
