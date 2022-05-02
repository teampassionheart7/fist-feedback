import { VipForm } from "@/store";
import { Memo } from "@/types";

export const isSubmitableForm = (form: VipForm) => (title: string) => {
  const memo = getSubmitableMemo(form.latestMemos, title);
  return memo != null;
};

export const getSubmitableMemo = (memos: Memo[], title: string) =>
  memos.find((v) => title?.length > 0 && v.memo.includes(title));
