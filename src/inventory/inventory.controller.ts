import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { InventoryService } from './inventory.service.js';
import { StockInDto } from './dto/stock-in.dto.js';
import { StockOutDto } from './dto/stock-out.dto.js';
import { StockTransferDto } from './dto/stock-transfer.dto.js';
import { FilterStockMovementsDto } from './dto/filter-stock-movements.dto.js';

@Controller('inventory')
export class InventoryController {
    constructor (private readonly inventoryService:InventoryService){}
@Post('stock-in')
async stockIn(@Body() stockInDto:StockInDto){
    return await this.inventoryService.stockIn(stockInDto)
}

@Post('stock-out')
async stockOut(@Body() stockOutDto:StockOutDto){
    return await this.inventoryService.stockOut(stockOutDto)
}

@Post('transfer')
async transfer (@Body() stockTransferDto:StockTransferDto){
    return await this.inventoryService.stockTransfer(
        stockTransferDto.sourceBranchId,
        stockTransferDto.destinationBranchId,
        stockTransferDto.batchId,
        stockTransferDto.quantity,
    )
}
 @Get('movements')
 findMovements(@Query() filters: FilterStockMovementsDto) {
   return this.inventoryService.findMovements(filters);
}
}
