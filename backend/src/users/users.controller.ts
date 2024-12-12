import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { CreateUserDto, UpdateUserDto } from "./dto";
import { UsersService } from "./users.service";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { UserResourceGruard } from "src/common/user-resource.guard";

interface IRequestWithUser extends Request {
    user: {
        userId: string;
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

    @Post('reset-password')
    resetPassword(@Body() ResetPasswordDto: ResetPasswordDto) {
        const { login, recoveryCode, newPassword } = ResetPasswordDto;
        return this.userService.resetPassword(login, recoveryCode, newPassword);
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    async getCurrentUser(@Req() req: IRequestWithUser) {
        console.log('Request user in getCurrentUser:', req.user);
        const user = await this.userService.findOne(req.user.userId);
        return user;
    }

    @Patch('display-name')
    @UseGuards(JwtAuthGuard)
    async updateDisplayName(
        @Req() req: IRequestWithUser,
        @Body('displayName') displayName: string
    ) {
        return this.userService.update(req.user.userId, { displayName })
    }
}