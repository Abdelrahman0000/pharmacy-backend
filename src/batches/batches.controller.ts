import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { BatchesService } from './batches.service.js';
import { CreateBatchDto } from './dto/create-batch.dto.js';
import { UpdateBatchDto } from './dto/update-batch.dto.js';

@Controller('batches')
export class BatchesController {
    constructor (private readonly batchesService:BatchesService ){}
    @Get()
    async findAll(){
        return await this.batchesService.findAll()
    }
    @Get(':id')
    async findOne(@Param('id',ParseIntPipe) id:number){
 return await this.batchesService.findOne(id)

    }
    
    @Post()
    async create(@Body() createBatchDto: CreateBatchDto){
return await this.batchesService.create(createBatchDto)

    }
    @Put(':id')
    async update(@Param('id',ParseIntPipe) id:number,@Body() updateBatchDto: UpdateBatchDto){
return await this.batchesService.update(id,updateBatchDto)

    }
    @Delete(':id')
        async remove(@Param('id',ParseIntPipe) id:number){
            return await this.batchesService.remove(id)
        }}