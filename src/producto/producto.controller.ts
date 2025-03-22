import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { ProductoService } from './producto.service';
import { ProductoEntity } from './entity/producto.entity';
import { CreateProductoDto } from './dto/create-producto.dto';
import { MessageDto } from 'src/common/message.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';

@Controller('producto')
export class ProductoController {
    constructor(private readonly productoService: ProductoService) { }


    //Obtener todos los productos
    @Get()
    async getAll(): Promise<ProductoEntity[]> {
        return this.productoService.getAllProductos();
    }

    //Obtener un producto por ID
    @Get(':id')
    async getOne(@Param('id', ParseIntPipe) id: number): Promise<ProductoEntity> {
        return this.productoService.findProductoById(id);
    }

    //Crear un nuevo producto
    @Post()
    async create(@Body() dto: CreateProductoDto): Promise<MessageDto> {
        return this.productoService.createProducto(dto);
    }

    //Actualizar un producto
    @Put(':id')
    async update(
        @Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProductoDto): Promise<MessageDto> {
        return this.productoService.updateProducto(id, dto);
    }

    // 🔹 Eliminar un producto
    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number): Promise<MessageDto> {
        return this.productoService.deleteProducto(id);
    }
 

}

