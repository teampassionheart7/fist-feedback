export type Lecture = {
  id: number;
  studio_id: number;
  type: string;
  title: string;
  course_id: number;
};

export type Member = {
  id: number;
  /** member_id와 동일 */
  ref_id: number;

  account_id: number;
  account_type: string;

  mobile: string;

  profile: {
    name: string;
  };
};

export type BookingStatus =
  | "cancel"
  | "attendance"
  | "absence"
  | "booking_confirmed";
export type Booking = {
  id: number;
  created_at: string;

  lecture: Lecture;
  lecture_id: number;

  member: Member;

  studio_id: number;
  ticket_id: number;

  status: BookingStatus;
};

export type Memo = {
  id: number;
  created_at: string;
  updated_at: string;

  /** user id */
  ref_id: number;

  memo: string;

  staff?: {
    name: string;
    roles: {
      id: number;
      name: string;
      /** 이것을 사용
       * @example '스튜디오 오너'*/
      display_name: string;
    }[];
  };
};
export const EmptyMemo: Memo = {
  id: null,
  created_at: null,
  updated_at: null,
  ref_id: null,
  memo: "(작성된 메모가 없습니다)",
};
