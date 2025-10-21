import { Controller, Post, Get, Body, Param, Patch, Delete, UseGuards, BadRequestException , Req } from '@nestjs/common';
import { PositionsService } from './positions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('positions')
@UseGuards(JwtAuthGuard)
export class PositionsController {
  constructor(private readonly positionsService: PositionsService) {}

  @Post()
  async create(@Body() body: { position_code: string; position_name: string }, @Req() req: any) {
    if (!body || !body.position_code || !body.position_name) {
      throw new BadRequestException('Missing required fields: position_code and position_name are required');
    }
    const userId = req.user?.userId;
    if (!userId) {
      throw new BadRequestException('Authentication required: valid JWT token must be provided');
    }
    return this.positionsService.createPosition(body.position_code, body.position_name, userId);
  }

  @Get()
  async findAll() {
    return this.positionsService.getAllPositions();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.positionsService.getPositionById(Number(id));
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() body: { positions_code?: string; positions_name?: string }
  ) {
    return this.positionsService.updatePosition(Number(id), body);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.positionsService.deletePosition(Number(id));
  }
}

