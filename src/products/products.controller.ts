import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { IsAuthGuard } from 'src/common/guard/isAuth.guard';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { IsAdminGuard } from 'src/common/guard/isAdmin.guard';
import { UserId } from 'src/common/decorator/user.decorator';
import { FilterProductsDTO } from './dto/filter.products.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('filter')
  findWithFilters(@Query() filterProductsDto: FilterProductsDTO) {
    return this.productsService.findWithFilter(filterProductsDto);
  }

  @UseGuards(IsAuthGuard, IsAdminGuard)
  @Delete('file')
  deleteFile(@Body('fileId') fileId: string) {
    return this.productsService.deleteFileById(fileId);
  }

  @UseGuards(IsAuthGuard, IsAdminGuard)
  @Post('get-file')
  getFile(@Body('fileId') fileId: string) {
    return this.productsService.getFileById(fileId);
  }

  @UseGuards(IsAuthGuard, IsAdminGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  UploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.productsService.uploadFile(file);
  }
  @UseGuards(IsAuthGuard, IsAdminGuard)
  @Post('upload-many')
  @UseInterceptors(FilesInterceptor('files'))
  UploadFiles(@UploadedFiles() files: Express.Multer.File[]) {
    return this.productsService.uploadFiles(files);
  }

  @UseGuards(IsAuthGuard, IsAdminGuard)
  @Post()
  create(@Body() createProductDto: CreateProductDto, @UserId() userId: string) {
    return this.productsService.create(createProductDto, userId);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }
  @UseGuards(IsAuthGuard, IsAdminGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }
  @UseGuards(IsAuthGuard, IsAdminGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
