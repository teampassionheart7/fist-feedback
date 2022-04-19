import { atom } from "recoil";

import { Member } from "@/types";

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

export const vipsState = atom<Member[]>({
  key: "vips",
  default: [],
});
