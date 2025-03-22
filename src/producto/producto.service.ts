import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductoEntity } from './entity/producto.entity';
import { Repository } from 'typeorm';
import { MessageDto } from 'src/common/message.dto';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';

@Injectable()
export class ProductoService {

    constructor(
        @InjectRepository(ProductoEntity)
        private readonly productoRepository: Repository<ProductoEntity>,
    ) { }

    // Listar todos los productos
    async getAllProductos(): Promise<ProductoEntity[]> {
        try {
            const productos = await this.productoRepository.find();
            if (!productos.length) {
                throw new NotFoundException(new MessageDto('No hay productos en la lista'));
            }
            return productos;
        } catch (error) {
            // Manejo de errores imprevistos
            throw new InternalServerErrorException(new MessageDto('Error al obtener la lista de productos'));
        }
    }

    // Encontrar un producto por ID
    async findProductoById(pro_id: number): Promise<ProductoEntity> {
        try {
            const producto = await this.productoRepository.findOne({ where: { pro_id } });
            if (!producto) {
                throw new NotFoundException(new MessageDto('El producto no existe'));
            }
            return producto;
        } catch (error) {
            // Capturar errores imprevistos y lanzar una excepción genérica
            throw new InternalServerErrorException(new MessageDto('Error al buscar el producto'));
        }
    }


    // Crear un producto con manejo de errores mediante try-catch
    async createProducto(dto: CreateProductoDto): Promise<MessageDto> {
        try {
            const { pro_nombre, pro_precio } = dto;

            // Verificar si el producto ya existe
            const exists = await this.productoRepository.findOne({ where: { pro_nombre } });
            if (exists) {
                throw new BadRequestException(new MessageDto('Ese producto ya existe'));
            }

            // Crear el producto utilizando los datos proporcionados
            const producto = this.productoRepository.create(dto);

            // Guardar el producto en la base de datos
            await this.productoRepository.save(producto);

            // Retornar mensaje de éxito
            return new MessageDto('El producto ha sido creado');
        } catch (error) {
            // Manejo de errores, lanzar excepciones personalizadas
            if (error instanceof BadRequestException) { // instanceof se utiliza para verificar si un objeto es una instancia de una clase
                // Re-lanzar la excepción si ya existe el producto
                throw error;
            }

            // Capturar cualquier otro error inesperado
            throw new InternalServerErrorException(
                new MessageDto('Error al intentar crear el producto')
            );
        }
    }



    // Método para actualizar un producto en la base de datos
    async updateProducto(pro_id: number, dto: UpdateProductoDto): Promise<MessageDto> {
        // Buscar el producto en la base de datos por su ID
        const producto = await this.findProductoById(pro_id);

        // Verificar si ya existe otro producto con el mismo nombre, pero diferente ID
        const exists = await this.productoRepository.createQueryBuilder('producto')
            .where('producto.pro_id != :pro_id', { pro_id }) // Excluye el producto actual
            .andWhere('producto.pro_nombre = :pro_nombre', { pro_nombre: dto.pro_nombre }) // Busca por nombre
            .getOne();

        // Si existe un producto con el mismo nombre, lanzar una excepción
        if (exists) {
            throw new BadRequestException(new MessageDto('Ese producto ya existe'));
        }

        // Actualizar las propiedades del producto solo si se proporcionan nuevos valores
        producto.pro_nombre = dto.pro_nombre ?? producto.pro_nombre; // Mantiene el nombre actual si no se envía uno nuevo
        producto.pro_precio = dto.pro_precio ?? producto.pro_precio; // Mantiene el precio actual si no se envía uno nuevo

        try {
            // Guardar los cambios en la base de datos
            await this.productoRepository.save(producto);
            // Devolver un mensaje indicando que el producto fue actualizado exitosamente
            return new MessageDto('Producto actualizado');

        } catch (error) {
            // Manejar errores y lanzar una excepción en caso de fallo
            throw new InternalServerErrorException(new MessageDto('Error al actualizar el producto'));
        }
    }


    // Método para eliminar un producto pasando directamente el objeto
    async deleteProducto(pro_id: number): Promise<MessageDto> {
        try {
            // Verificar si el producto existe mediante su ID
            const producto = await this.findProductoById(pro_id);

            // Eliminar el producto directamente pasando el objeto completo
            await this.productoRepository.delete(producto);

            // Retornar un mensaje indicando que el producto fue eliminado
            return new MessageDto('Producto eliminado');
        } catch (error) {
            // Manejar los errores, como si no se encuentra el producto
            throw new InternalServerErrorException(new MessageDto('Error al intentar eliminar el producto'));
        }
    }


}
