import { Injectable } from '@nestjs/common';
import * as grpc from '@grpc/grpc-js';
import { ConfigService } from '@nestjs/config';

const { ClarifaiStub } = require('clarifai-nodejs-grpc');

@Injectable()
export class ClarifaiService {
  private readonly CLARIFAI_API_KEY: string;

  constructor(private readonly configService: ConfigService) {
    this.CLARIFAI_API_KEY = this.configService.get<string>('CLARIFAI_API_KEY');
  }

  async recognitionImageDetail(imagenPrueba: string): Promise<string> {
    let result: string = '';

    const stub = ClarifaiStub.grpc();

    const metadata = new grpc.Metadata();
    metadata.set('authorization', 'Key ' + this.CLARIFAI_API_KEY);

    const response = await new Promise((resolve, reject) => {
      stub.PostModelOutputs(
        {
          user_app_id: {
            user_id: 'clarifai',
            app_id: 'main',
          },
          model_id: 'general-image-recognition',
          inputs: [{ data: { image: { base64: imagenPrueba } } }],
        },
        metadata,
        (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response);
          }
        },
      );
    });

    // @ts-ignore
    const output = response.outputs[0];

    // console.log('Predicted concepts:');
    for (const concept of output.data.concepts) {
      // console.log(concept.name + ' ' + concept.value);
      result += concept.name + ' ' + concept.value + ' \n';
    }

    return result;
  }
}
