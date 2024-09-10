import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { CreateUserDto, UpdateUserDto } from "./dto";
import { UsersService } from "./users.service";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { UserResourceGruard } from "src/common/user-resource.guard";

@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService) { }

    @Post()
    create(@Body() createUserDto: CreateUserDto) {
        return this.userService.create(createUserDto);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    finAll() {
        return this.userService.findAll();
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    findOne(@Param('id') id: string) {
        return this.userService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard, UserResourceGruard)
    update(@Param('id') id: string, @Body() UpdateUserDto: UpdateUserDto) {
        return this.userService.update(id, UpdateUserDto)
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
}