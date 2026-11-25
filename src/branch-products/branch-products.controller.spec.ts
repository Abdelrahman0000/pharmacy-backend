import { Test, TestingModule } from '@nestjs/testing';
import { BranchProductsController } from './branch-products.controller.js';

describe('BranchProductsController', () => {
  let controller: BranchProductsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BranchProductsController],
    }).compile();

    controller = module.get<BranchProductsController>(BranchProductsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
