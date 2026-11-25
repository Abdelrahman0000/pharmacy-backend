
import { Controller, Get, Post, Body , Param, ParseIntPipe,Put,Delete, BadRequestException, Patch } from '@nestjs/common';
import { BranchesService } from './branches.service.js';
import { CreateBranchDto } from './dto/create-branch.dto.js';
import { UpdateBranchDto } from './dto/update-branch.dto.js';
@Controller('branches')
export class BranchesController {
  constructor(private readonly branchesService: BranchesService) {}

  @Get()
  async findAll() {
    return this.branchesService.findAllActive();
  }
@Get('inactive')
  async findInactive() {
    return this.branchesService.findAllInactive();
  }
  @Post()
  async create(@Body() createBranchDto: CreateBranchDto) {
    return this.branchesService.create(createBranchDto);
  }
  @Get(':id')
  async findOne(@Param('id',ParseIntPipe) id:number ){
return this.branchesService.findOne(id);
  }
  @Put(':id')
  async update(@Param('id',ParseIntPipe) id:number, @Body() updateBranchDto: UpdateBranchDto){
   if (Object.keys(updateBranchDto).length === 0) {
        throw new BadRequestException(
          'At least one field is required to update a branch',
        );
      }
    return this.branchesService.update(id, updateBranchDto);
  }
  @Delete(':id')
  async remove(@Param('id',ParseIntPipe) id:number){
    return this.branchesService.remove(id);
  }
  @Patch(':id/activate')
    async activate(@Param('id',ParseIntPipe) id:number){
    return this.branchesService.activate(id);
    }
}
