import { Redis } from '@upstash/redis';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import {
  Index,
  PineconeClient,
  RecordMetadata,
} from '@pinecone-database/pinecone';

export type CompanionKey = {
  companionName: string;
  modelName: string;
  userId: string;
};

export class MemoryManager {
  private static instance: MemoryManager;
  private history: Redis;
  private vectorDBClient: PineconeClient;

  constructor() {
    this.history = Redis.fromEnv();
    this.vectorDBClient = new PineconeClient();
  }

  async init() {
    if (this.vectorDBClient instanceof PineconeClient) {
      await this.vectorDBClient.init({
        apiKey: process.env?.PINECONE_API_KEY! || '',
        environment: process.env.PINECONE_ENVIRONMENT! || '',
      });
    }
  }

  private generateRedisCompanionKey(companionKey: CompanionKey): string {
    return `${companionKey.companionName}-${companionKey.modelName}-${companionKey.userId}`;
  }

  static async getInstance(): Promise<MemoryManager> {
    if (!MemoryManager.instance) {
      MemoryManager.instance = new MemoryManager();
      await MemoryManager.instance.init();
    }

    return MemoryManager.instance;
  }

  async vectorSearch(recentChatHistory: string, companionFilename: string) {
    const pineconeClient = <PineconeClient>this.vectorDBClient;

    const pineconeIndex = pineconeClient.Index(
      process.env.PINECONE_INDEX! || ''
    ) as unknown as Index<RecordMetadata>;

    const vectorStore = await PineconeStore.fromExistingIndex(
      new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY }),
      { pineconeIndex }
    );

    const similarDocs = vectorStore
      .similaritySearch(recentChatHistory, 3, { fileName: companionFilename })
      .catch((error) =>
        console.error('Failed to get vector search result', error)
      );

    return similarDocs;
  }

  async writeToHistory(text: string, companionKey: CompanionKey) {
    if (!companionKey || typeof companionKey.userId == 'undefined') {
      console.error('Companion key is incorrect.');
      return '';
    }

    const key = this.generateRedisCompanionKey(companionKey);
    const result = await this.history.zadd(key, {
      score: Date.now(),
      member: text,
    });

    return result;
  }

  async readLatestHistory(companionKey: CompanionKey): Promise<string> {
    if (!companionKey || typeof companionKey.userId == 'undefined') {
      console.error('Companion key is incorrect.');
      return '';
    }

    const key = this.generateRedisCompanionKey(companionKey);
    let result = await this.history.zrange(key, 0, Date.now(), {
      byScore: true,
    });
    result = result.slice(-30).reverse();

    return result.reverse().join('\n');
  }

  async seedChatHistory(
    seedContent: string,
    delimmiter: string = '\n',
    companionKey: CompanionKey
  ) {
    const key = this.generateRedisCompanionKey(companionKey);

    if (await this.history.exists(key)) {
      console.log('Chat history exists.');
      return;
    }

    const content = seedContent.split(delimmiter);
    let counter = 0;

    for (const line of content) {
      await this.history.zadd(key, { score: counter, member: line });
      counter++;
    }
  }
}
