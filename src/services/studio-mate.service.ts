import axios from "axios";

import { Booking, Member, Memo } from "@/types";

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

  /** 입력된 기간동안 3번 이상 출석한 회원의 목록을 반환합니다. */
  async getVips(
    startDate: string,
    endDate: string,
    token: string
  ): Promise<Member[]> {
    const {
      data: {
        bookings: { data: bookings },
      },
    } = await axios.get<{ bookings: ListResult<Booking> }>(
      `https://api.studiomate.kr/staff/booking?start_date=${startDate}&end_date=${endDate}&page=0&limit=999999&status=attendance`,
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    const attenders = bookings
      .filter((v) => v.status === "attendance")
      .map((v) => v.member)
      .filter((member) => !member.name.includes("예약회원"));

    const countMap = new Map<number, number>();
    const vips: Member[] = [];
    attenders.forEach((member) => {
      const count = countMap.get(member.id) ?? 0;
      if (count + 1 >= 3 && !vips.find((v) => v.id === member.id)) {
        vips.push(member);
        return;
      }

      countMap.set(member.id, count + 1);
    });

    return vips;
  }

  async getLatestMemo(memberId: number, token: string): Promise<string | null> {
    const { data } = await axios.get<Memo[]>(
      `https://api.studiomate.kr/v2/staff/memo?ref_type=member&ref_id=${memberId}`,
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    return data.length > 0 ? data.sort((a, b) => b.id - a.id)[0].memo : null;
  }

  async sendMessage(
    memberId: number,
    title: string,
    message: string,
    token: string
  ) {
    await axios.post(
      "https://api.studiomate.kr/staff/studio_message",
      {
        studio_message: {
          body: message,
          member_filter: {},
          send_on: "",
          targets: [{ studio_user_id: memberId }],
          title,
        },
      },
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
  }
}

export default new StudioMateService();
