import {
  Controller,
  Get,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { IsAuthGuard } from 'src/common/guard/isAuth.guard';
import { IsAdminGuard } from 'src/common/guard/isAdmin.guard';
import { Role } from 'src/common/enum/roles.enum';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
  @UseGuards(IsAuthGuard, IsAdminGuard)
  @Patch('role/:id')
  updateRole(@Param('userId') userId: string, @Body('role') role: Role) {
    return this.usersService.updateUserRole(userId, role);
  }
}
