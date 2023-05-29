import {Module} from '@nestjs/common';
import {DenunciasService} from './denuncias.service';
import {DenunciasController} from './denuncias.controller';
import {OpenaiService} from '../components/openai/openai.service';
import {DropboxClientService} from '../components/dropbox-client/dropbox-client.service';
import {ClarifaiService} from '../components/clarifai/clarifai.service';
import {ConfigService} from '@nestjs/config';
import {PromptsService} from "./prompts.service";
import {DenunciasValidatorService} from "./denuncias.validator.service";

@Module({
    controllers: [DenunciasController],
    providers: [
        DenunciasService,
        DenunciasValidatorService,
        PromptsService,
        OpenaiService,
        DropboxClientService,
        ClarifaiService,
        ConfigService,
    ],
})
export class DenunciasModule {
}
