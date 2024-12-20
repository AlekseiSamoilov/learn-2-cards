import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UnauthorizedException, UseGuards } from "@nestjs/common";
import { CreateUserDto, UpdateUserDto } from "./dto";
import { UsersService } from "./users.service";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { UserResourceGruard } from "src/common/user-resource.guard";

interface IRequestWithUser extends Request {
    user: {
        id: string;
        login: string;
        displayName?: string;
    }
}

@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService) { }

    @Post()
    create(@Body() createUserDto: CreateUserDto) {
        return this.userService.create(createUserDto);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    findAll() {
        return this.userService.findAll();
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    async getMe(@Req() req: any) {
        try {
            const user = await this.userService.findOne(req.user.id);

            return {
                id: user._id.toString(),
                login: user.login,
                displayName: user.displayName,
                recoveryCode: user.recoveryCode
            };
        } catch (error) {
            throw new UnauthorizedException('User not found');
        }
    }


    @Post('reset-password')
    async esetPassword(@Body() ResetPasswordDto: ResetPasswordDto) {
        const { login, recoveryCode, newPassword } = ResetPasswordDto;
        await this.userService.resetPassword(login, recoveryCode, newPassword);
        const updatedUser = await this.userService.findByLogin(login);

        return {
            recoveryCode: updatedUser.recoveryCode,
            message: 'Password has benn reset successfully'
        }
    }

    @Patch('display-name')
    @UseGuards(JwtAuthGuard)
    async updateDisplayName(
        @Req() req: IRequestWithUser,
        @Body('displayName') displayName: string
    ) {
        const updatedUser = await this.userService.update(req.user.id, { displayName });

        return {
            id: updatedUser._id.toString(),
            login: updatedUser.login,
            displayName: updatedUser.displayName,
            recoveryCode: updatedUser.recoveryCode
        }
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    findOne(@Param('id') id: string) {
        return this.userService.findOne(id);
    }

    @Get(':login')
    @UseGuards(JwtAuthGuard)
    findByLogin(@Param('login') login: string) {
        return this.userService.findOne(login)
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard, UserResourceGruard)
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.userService.update(id, updateUserDto)
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, UserResourceGruard)
    remove(@Param('id') id: string) {
        return this.userService.remove(id);
    }
}