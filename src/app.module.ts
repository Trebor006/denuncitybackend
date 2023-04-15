import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {LoginEventsModule} from './login-events/login-events.module';
import {MongooseModule} from '@nestjs/mongoose';

@Module({
    imports: [
        LoginEventsModule,
        MongooseModule.forRoot(
            'mongodb+srv://trebor006:Shq8VuYx07PLmybW@cluster0.zyxpltf.mongodb.net/denuncitydb?retryWrites=true&w=majority',
        ),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
