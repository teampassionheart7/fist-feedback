import { useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";

import { StudioMateService } from "@/services";
import {
  vipsState,
  vipFormsState,
  greetingsState,
  closingsState,
  accessTokenState,
} from "@/store";
import { Member } from "@/types";

export const useVipForms = () => {
  const accessToken = useRecoilValue(accessTokenState);

  const vips = useRecoilValue(vipsState);
  const greetings = useRecoilValue(greetingsState);
  const closings = useRecoilValue(closingsState);

  const [vipForms, setVipForms] = useRecoilState(vipFormsState);

  const isEmpty = vipForms.length === 0;
  const isLoadingMemo =
    !isEmpty && vipForms.filter((v) => v.latestMemo == null).length > 0;

  useEffect(() => {
    setVipForms(
      vips.map((v) => ({
        member: v,
        latestMemo: null,
        message: null,
        submitted: false,
      }))
    );
    loadMemos(vips);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vips.length]);

  const loadMemos = async (members: Member[]) => {
    for (const member of members) {
      const memo = await StudioMateService.getLatestMemo(
        member.id,
        accessToken!
      );
      onLoadMemo(member.id, memo ?? "");
    }
  };

  /** 메모와, 인사말/맺음말을 조합해 각 메세지를 설정합니다.  */
  const onLoadMemo = (memberId: number, memo: string) => {
    const greeting = [...greetings].sort(() => Math.random() - 0.5)[0];
    const closing = [...closings].sort(() => Math.random() - 0.5)[0];

    setVipForms((prev) =>
      prev.map((v) => {
        if (v.member.id === memberId) {
          const firstname = v.member.name.slice(1);

          return {
            ...v,
            latestMemo: memo,
            message: `${firstname}${greeting}\n\n${memo
              .replace(/^(\<\d+월\s.+\s주\s피드백\>\n)/, "")
              .replace(firstname + "\n", "")}\n\n${closing}`,
          };
        }

        return v;
      })
    );
  };

  const setMessage = (memberId: number, message: string) => {
    setVipForms((prev) =>
      prev.map((v) => (v.member.id === memberId ? { ...v, message } : v))
    );
  };

  const submit = async (memberId: number) => {};

  return {
    vipForms,
    isEmpty,
    isLoadingMemo,
    onLoadMemo,
    setMessage,
  };
};
