import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Staff } from '../entities/staff.entity';
import { StaffService } from '../services/staff.service';
import { CreateStaffDto } from '../dto/create-staff.dto';
import { UpdateStaffDto } from '../dto/update-staff.dto';

@Resolver(() => Staff)
export class StaffResolver {
  constructor(private readonly staffService: StaffService) {}

  @Query(() => [Staff], { name: 'staff' })
  async findAll(): Promise<Staff[]> {
    return this.staffService.findAll();
  }

  @Query(() => Staff, { name: 'staffById' })
  async findOne(@Args('id') id: string): Promise<Staff> {
    return this.staffService.findOne(id);
  }

  @Mutation(() => Staff, { name: 'createStaff' })
  async create(@Args('createStaffInput') createStaffDto: CreateStaffDto): Promise<Staff> {
    return this.staffService.create(createStaffDto);
  }

  @Mutation(() => Staff, { name: 'updateStaff' })
  async update(
    @Args('id') id: string,
    @Args('updateStaffInput') updateStaffDto: UpdateStaffDto,
  ): Promise<Staff> {
    return this.staffService.update(id, updateStaffDto);
  }

  @Mutation(() => Boolean, { name: 'deleteStaff' })
  async remove(@Args('id') id: string): Promise<boolean> {
    return this.staffService.remove(id);
  }

  @Mutation(() => Boolean, { name: 'syncStaff' })
  async sync(): Promise<boolean> {
    return this.staffService.syncStaffFromApi();
  }
}