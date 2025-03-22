import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { RolEntity } from 'src/rol/entity/rol.entity';
import { CreateUsuarioDto } from 'src/usuario/dto/create-usuario.dto';
import { UsuarioEntity } from 'src/usuario/entity/usuario.entity';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { MessageDto } from 'src/common/message.dto';


@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        @InjectRepository(UsuarioEntity)
        private usuarioRepository: Repository<UsuarioEntity>,
        @InjectRepository(RolEntity)
        private rolRepository: Repository<RolEntity>
    ){}

    async register(userData: CreateUsuarioDto){
        //Generar un salt para mejorar la seguridad del hash de la contraseña
        const salt = await bcrypt.genSalt(10);

        //Hashea la contraseña del usuario con el salt generado
        const hashedPassword = await bcrypt.hash(userData.usu_password, salt)

        const rol = await this.rolRepository.findOne({where: {rol_id: userData.rolId}})

        if(!rol){
            throw new BadRequestException('El rol especifado no existe');
        }

        const newUser = this.usuarioRepository.create({
            ...userData,
            usu_password: hashedPassword,
            rol
        })

        await this.usuarioRepository.save(newUser)

        return new MessageDto('Usuario Registrado exitosamente');
    }

    async validateUser(username: string, password: string): Promise<any>{
        //Buscar un usuario en la base de datos por nombre y obtenemos el rol
        const user = await this.usuarioRepository.findOne({where: {usu_nombreUsuario: username}, relations: ['rol']})
        
        //Verifcamos si el usuario existe y la contraseña proporcionada coincide con la de la base de datos
        if(user && await bcrypt.compare(password, user.usu_password)){
            //Excluye la contraseña del objeto retornado para brindar mayor seguridad
            const {usu_password, ...result} = user;
            return result //Retorna el usuario autenticado sin la contraseña
        }
        return null //Retorna null si las credenciales no coinciden
    }

    async generateToken(user: any): Promise<{access_token: string}>{
        //Creamos payload con los datos clave del usuario
        const payload = {username: user.user_nombreUsuario, sub: user.user_id, role: user.rol.rol_nombre};
        //Genera un token de acceso usando el servicio de JWT y retorna el token
        return {access_token: this.jwtService.sign(payload)}
    }

    async login(username: string, password: string){
        //Validamos las credenciales del usuario
        const user = await this.validateUser(username, password);

        if(!user){
            throw new UnauthorizedException('Credenciales incorrectas');
        }
        return this.generateToken(user)
    }
}
