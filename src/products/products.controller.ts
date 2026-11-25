
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
} from '@nestjs/common';

import { ProductsService } from './products.service.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
  ) {}

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get('inactive')
  findInactive() {
    return this.productsService.findInactive();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  @Post()
  create(@Body() body: CreateProductDto) {
    return this.productsService.create(body);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateProductDto,
  ) {
    if (Object.keys(body).length === 0) {
      throw new BadRequestException(
        'At least one field is required to update a product',
      );
    }

    return this.productsService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id);
  }

  @Patch(':id/activate')
  activate(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.activate(id);
  }
}
