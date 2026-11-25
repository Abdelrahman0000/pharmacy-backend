import { Controller, Get, ParseIntPipe , Param, Post, Body, Put, Delete } from '@nestjs/common';
import { BranchProductsService } from './branch-products.service.js';
import { CreateBranchProductDto } from './dto/create-branch-product.dto.js';
import { UpdateBranchProductDto } from './dto/update-branch-product.dto.js';

@Controller('branch-products')
export class BranchProductsController {
    constructor(private readonly branchProductsService: BranchProductsService) {}
@Get()
async findAll() {
return this.branchProductsService.findAll();
}

@Get(':id')
async findOne(@Param('id',ParseIntPipe) id:number ){
    return this.branchProductsService.findOne(id);
}
@Post()
async create (@Body() createBranchProductDto: CreateBranchProductDto) {
    return this.branchProductsService.create(createBranchProductDto); 
}
@Put(':id')
async update(@Param('id', ParseIntPipe) id: number, @Body() updateBranchProductDto: UpdateBranchProductDto) {
    return this.branchProductsService.update(id, updateBranchProductDto);}
    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number) {
        return this.branchProductsService.remove(id);
    }
}
