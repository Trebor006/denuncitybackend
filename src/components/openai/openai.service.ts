import { Injectable } from '@nestjs/common';
import { Configuration, OpenAIApi } from 'openai';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OpenaiService {
  constructor(private configService: ConfigService) {}

  async generateRequest(message: string) {
    const configuration = new Configuration({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
    const openai = new OpenAIApi(configuration);

    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: message }],
      temperature: 0.7,
    });

    const result = completion.data.choices[0].message.content;
    console.log('result from chatgpt:: ' + result);

    return result;
  }
}
