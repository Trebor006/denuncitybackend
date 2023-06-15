import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as yaml from 'js-yaml';

@Injectable()
export class PromptsService {
  private readonly prompts: any[];

  constructor() {
    this.prompts = yaml.load(fs.readFileSync('chat_gpt_prompts.yaml', 'utf-8'));
  }

  getPromptByCode(code: string): any {
    const prompt = this.prompts.find((prompt) => prompt.code === code);
    return prompt ? prompt.value : null;
  }
}
