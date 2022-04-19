export type Lecture = {
  id: number;
  studio_id: number;
  type: string;
  title: string;
  course_id: number;
};

export type Member = {
  id: number;
  account_id: number;
  account_type: string;

  mobile: string;
  name: string;
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
