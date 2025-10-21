import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from "@nestjs/common";
import { UsersService } from './users.service';
import { JwtAuthGuard } from "../auth/jwt-auth.guard";


@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  
  // get (protect)
  @UseGuards(JwtAuthGuard)
  @Get()
  async getALL() {
    return this.usersService.getAll();
  }

  // get sigle
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.usersService.findById(+id);
  }

  // create users (open - for demo)
  @Post()
  async create(@Body() body: { username: string; password: string; fullname: string; email: string }) {
    if (!body || !body.username || !body.password || !body.fullname || !body.email) {
      throw new Error('Missing required fields: username, password, fullname, email');
    }
    return this.usersService.createUser(body.username, body.password , body.fullname, body.email);
  }

  // update
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.usersService.updateUser(+id, body);
  }

  // DELETE
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.usersService.deleteUser(+id);
  }
}