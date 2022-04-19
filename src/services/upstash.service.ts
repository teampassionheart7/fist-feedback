import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_URL,
  token: process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_TOKEN,
});

const KEY = {
  Greetings: "greetings",
  Closings: "closings",
};

const SEPERATOR = "!!seperator!!";

class UpstashService {
  async greetings(): Promise<string[]> {
    const res = await redis.get<string>(KEY.Greetings);
    return (res ?? "").split(SEPERATOR).filter((v) => v);
  }

  async saveGreetings(input: string[]) {
    await redis.set(KEY.Greetings, input.join(SEPERATOR));
  }

  async closings(): Promise<string[]> {
    const res = await redis.get<string>(KEY.Closings);
    return (res ?? "").split(SEPERATOR).filter((v) => v);
  }

  async saveClosings(input: string[]) {
    await redis.set(KEY.Closings, input.join(SEPERATOR));
  }
}

export default new UpstashService();
