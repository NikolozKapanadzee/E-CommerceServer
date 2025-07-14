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
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { IsAuthGuard } from 'src/auth/guard/isAuth.gurad';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Delete('file')
  deleteFile(@Body('fileId') fileId: string) {
    return this.productsService.deleteFileById(fileId);
  }

  @Post('get-file')
  getFile(@Body('fileId') fileId: string) {
    return this.productsService.getFileById(fileId);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  UploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.productsService.uploadFile(file);
  }
  @Post('upload-many')
  @UseInterceptors(FilesInterceptor('files'))
  UploadFiles(@UploadedFiles() files: Express.Multer.File[]) {
    return this.productsService.uploadFiles(files);
  }

  @UseGuards(IsAuthGuard)
  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }
  @UseGuards(IsAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }
  @UseGuards(IsAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
