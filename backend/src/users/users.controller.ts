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
        console.log('4. UsersController getMe - full request:', req);
        console.log('5. UsersController getMe - req.user:', req.user);

        try {
            const user = await this.userService.findOne(req.user.id);
            console.log('6. UsersController getMe - found user:', user);

            return {
                id: user._id.toString(),
                login: user.login,
                displayName: user.displayName,
                recoveryCode: user.recoveryCode
            };
        } catch (error) {
            console.error('7. GetMe error:', error);
            throw new UnauthorizedException('User not found');
        }
    }


    @Post('reset-password')
    resetPassword(@Body() ResetPasswordDto: ResetPasswordDto) {
        const { login, recoveryCode, newPassword } = ResetPasswordDto;
        return this.userService.resetPassword(login, recoveryCode, newPassword);
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