import { Body, Controller, Get, Post, Request, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUsuarioDto } from 'src/usuario/dto/create-usuario.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}

    @Post('register')
    async register(@Body() user: CreateUsuarioDto){
        return this.authService.register(user)
    }

    @Post('login')
    async login(@Body() body: {usu_nombreUsuario: string; usu_password: string}){
        //Recibe el nombre del usuario y la contraseña en el cuerpo de la solicitud y la enviamos al metodo login del servicio AuthService
        return this.authService.login(body.usu_nombreUsuario, body.usu_password)
    }


    @Get('admin') //Ruta GET /auth/admin
    @UseGuards(JwtAuthGuard, RolesGuard) //Aplicamos los guards para verificar el tokem JWT
    @Roles('admin') //Requiere que el usuario tenga el rol admin para acceder a esta ruta
    getAdminData(@Request() req){
        if(!req.user){
            throw new UnauthorizedException('Acceso no autarizado')
        }
        return {message: 'Acceso valido para admin', user: req.user}
    }
}
