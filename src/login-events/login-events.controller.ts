import { Body, Controller, Post } from '@nestjs/common';
import { LoginEventsService } from './login-events.service';
import { LoginUserDto } from './dto/login-user.dto';
import { UserRegisterDto } from './dto/register-login-event.dto';

@Controller('login-events')
export class LoginEventsController {
  constructor(private readonly loginEventsService: LoginEventsService) {}

  @Post('register')
  register(@Body() userRegisterDto: UserRegisterDto) {
    console.log('Register');

    return this.loginEventsService.register(userRegisterDto);
  }

  @Post('login')
  login(@Body() createLoginEventDto: LoginUserDto) {
    console.log('login');

    return this.loginEventsService.login(createLoginEventDto);
  }

  // @Get()
  // findAll() {
  //   return this.loginEventsService.findAll();
  // }
  //
  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.loginEventsService.findOne(+id);
  // }
  //
  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateLoginEventDto: UpdateLoginEventDto) {
  //   return this.loginEventsService.update(+id, updateLoginEventDto);
  // }
  //
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.loginEventsService.remove(+id);
  // }
}
