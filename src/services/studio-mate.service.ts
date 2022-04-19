import axios from "axios";

import { Booking } from "@/types";

export type StudioMateLoginResult = {
  access_token: string;
  expires_in: number;
  studio_id: number;
  studio_name: string;
  token_type: string;
  user_id: number;
};

export type ListResult<Data> = {
  current_page: number;
  data: Data[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  next_page_url: string;
  path: string;
  per_page: string;
  prev_page_url: string;
  to: number;
  total: number;
};

const STUDIO_ID = 3093;

class StudioMateService {
  async login(identity: string, password: string): Promise<string> {
    const { data } = await axios.post<StudioMateLoginResult>(
      "https://api.studiomate.kr/staff/login",
      {
        identity,
        password,
        studio_id: STUDIO_ID,
      }
    );

    return data.access_token;
  }

  async loadAttendBookings(startDate: string, endDate: string, token: string) {
    const { data } = await axios.get<{ bookings: ListResult<Booking> }>(
      `https://api.studiomate.kr/staff/booking?start_date=${startDate}&end_date=${endDate}&page=0&limit=1000&status=attendance`,
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    return data.bookings;
  }
}

export default new StudioMateService();
