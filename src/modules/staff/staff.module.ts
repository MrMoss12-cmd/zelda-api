import { Module } from '@nestjs/common';
import { StaffService } from './services/staff.service';
import { StaffResolver } from './resolvers/staff.resolver';
import { PrismaService } from '../prisma/prisma.service';
import { StaffApiService } from './services/staff-api.service';

@Module({
  providers: [StaffService, StaffResolver, PrismaService, StaffApiService],
})
export class StaffModule {}