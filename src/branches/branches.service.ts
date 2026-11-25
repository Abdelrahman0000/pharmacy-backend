import {  ConflictException, Injectable , NotFoundException } from '@nestjs/common';
import {CreateBranchDto} from './dto/create-branch.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { UpdateBranchDto } from './dto/update-branch.dto.js';
@Injectable()
export class BranchesService {
    constructor(private readonly prisma:PrismaService) {}
    async findAllActive() {
        return await this.prisma.branch.findMany({
            where: { isActive: true }
        });
    }
    async findAllInactive() {
        return await this.prisma.branch.findMany({
            where: { isActive: false }
        });
    }
    async findOne(id: number) {

        const branch = await this.prisma.branch.findUnique({
            where: { id }
        })
        if (!branch) {
            throw new NotFoundException(`Branch with ID ${id} not found`);
        }
        return branch;
    }
async update(id:number , data:UpdateBranchDto) {
    await this.findOne(id);
    return await this.prisma.branch.update({
        where:{id},
        data:data
    })
}
    async create(createBranchDto: CreateBranchDto) {
    return await this.prisma.branch.create({
        data: createBranchDto
    })

}

async activate(id: number) {
  const branch = await this.findOne(id);

  if (branch.isActive) {
    throw new ConflictException(
      `Branch with ID ${id} is already active`,
    );
  }

  return this.prisma.branch.update({
    where: { id },
    data: { isActive: true },
  });
}
async remove(id: number) {
  const branch = await this.findOne(id);

  if (!branch.isActive) {
    throw new ConflictException(
      `Branch with ID ${id} is already inactive`,
    );
  }

  return this.prisma.branch.update({
    where: { id },
    data: { isActive: false },
  });
}

}
