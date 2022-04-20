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

type VipForm = {
  member: Member;
  latestMemo: string;
  /** 전송될 메세지 */
  message: string;
  submitted: boolean;
  submitting: boolean;
};
export const vipFormsState = atom<VipForm[]>({
  key: "vipForms",
  default: [],
});

export const greetingsState = atom<string[]>({
  key: "greetings",
  default: [],
});

export const closingsState = atom<string[]>({
  key: "closings",
  default: [],
});

export const titleState = atom<string | null>({
  key: "title",
  default: null,
});
