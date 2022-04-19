import axios from "axios";

const STUDIO_ID = 3093;

class StudioMateService {
  async login(identity: string, password: string): Promise<string> {
    const { data } = await axios.post<{
      access_token: string;
      expires_in: number;
      studio_id: number;
      studio_name: string;
      token_type: string;
      user_id: number;
    }>("https://api.studiomate.kr/staff/login", {
      identity,
      password,
      studio_id: STUDIO_ID,
    });

    return data.access_token;
  }
}

export default new StudioMateService();
