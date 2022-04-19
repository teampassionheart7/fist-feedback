import { useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";

import {
  vipsState,
  vipFormsState,
  greetingsState,
  closingsState,
} from "@/store";

export const useVipForms = () => {
  const vips = useRecoilValue(vipsState);
  const greetings = useRecoilValue(greetingsState);
  const closings = useRecoilValue(closingsState);

  const [vipForms, setVipForms] = useRecoilState(vipFormsState);

  const isLoadingMemo = vipForms.filter((v) => !v.latestMemo).length > 0;

  useEffect(() => {
    setVipForms(vips.map((v) => ({ member: v, latestMemo: "", message: "" })));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vips.length]);

  /** 메모와, 인사말/맺음말을 조합해 각 메세지를 설정합니다.  */
  const onLoadMemo = (memberId: number, memo: string) => {
    const greeting = greetings.sort(() => Math.random() - 0.5)[0];
    const closing = closings.sort(() => Math.random() - 0.5)[0];

    setVipForms((prev) =>
      prev.map((v) =>
        v.member.id === memberId
          ? {
              ...v,
              latestMemo: memo,
              message: `${greeting}\n\n${memo}\n\n${closing}`,
            }
          : v
      )
    );
  };

  const setMessage = (memberId: number, message: string) => {
    setVipForms((prev) =>
      prev.map((v) => (v.member.id === memberId ? { ...v, message } : v))
    );
  };

  return {
    vipForms,
    isLoadingMemo,
    onLoadMemo,
    setMessage,
  };
};
