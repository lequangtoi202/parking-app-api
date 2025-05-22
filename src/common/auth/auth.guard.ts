import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { Role } from 'src/common/types';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
    const req = ctx.getContext().req;

    await this.authenticateUser(req);

    return this.authorizeUser(req, context);
  }

  private async authenticateUser(req: any): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
    const bearerHeader = req.headers.authorization;
    // Bearer eylskfdjlsdf309
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    const token = bearerHeader?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('No token provided.');
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-argument
      req.user = await this.jwtService.verify(token);
    } catch (err) {
      console.error('Token validation error:', err);
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (!req.user) {
      throw new UnauthorizedException('Invalid token.');
    }
  }

  private async authorizeUser(
    req: any,
    context: ExecutionContext,
  ): Promise<boolean> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access
    const userRoles = await this.getUserRoles(req.user.uid);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    req.user.roles = userRoles;

    const requiredRoles = this.getMetadata<Role[]>('roles', context);
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    return requiredRoles.some((role) => userRoles.includes(role));
  }

  private getMetadata<T>(key: string, context: ExecutionContext): T {
    return this.reflector.getAllAndOverride<T>(key, [
      context.getHandler(),
      context.getClass(),
    ]);
  }

  private async getUserRoles(uid: string): Promise<Role[]> {
    const rolePromises = [
      this.prisma.admin.findUnique({ where: { uid } }),
      // Add promises for other role models here
    ];

    const roles: Role[] = [];

    const [admin] = await Promise.all(rolePromises);
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    admin && roles.push('admin');

    return roles;
  }
}
