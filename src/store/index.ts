import { Booking } from "@/types";
import { atom } from "recoil";

export const accessTokenState = atom<string | null>({
  key: "accessToken",
  default: null,
});

export const startDateState = atom<string | null>({
  key: "startDate",
  default: null,
});

export const endDateState = atom<string | null>({
  key: "endDate",
  default: null,
});

export const bookingListState = atom<Booking[]>({
  key: "bookingList",
  default: [],
});
