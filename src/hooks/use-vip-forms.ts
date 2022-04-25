import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { message } from "antd";

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
  const [isSubmitting, setSubmitting] = useState(false);
  const [memoLoadingMemberId, setMemoLoadingMemberId] = useState<number>(null);

  useEffect(() => {
    setVipForms(
      vips.map((v) => ({
        member: v,
        latestMemo: null,
        message: null,
        submitted: false,
        submitting: false,
      }))
    );
    loadMemos(vips);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vips.length]);

  const loadMemos = async (members: Member[]) => {
    for (const member of members) {
      await loadMemo(member.id);
    }
  };

  /** 메모와, 인사말/맺음말을 조합해 각 메세지를 설정합니다.  */
  const loadMemo = async (memberId: number) => {
    setMemoLoadingMemberId(memberId);
    const memo = await StudioMateService.getLatestMemo(memberId, accessToken!);

    const greeting = [...greetings].sort(() => Math.random() - 0.5)[0];
    const closing = [...closings].sort(() => Math.random() - 0.5)[0];

    setVipForms((prev) =>
      prev.map((v) => {
        if (v.member.id === memberId) {
          const firstname = v.member.name.slice(1);

          return {
            ...v,
            latestMemo: memo,
            message: `${firstname}${greeting}\n\n${memo.memo
              .replace(/^(\<\d+월\s.+\s주\s피드백\>\n)/, "")
              .replace(firstname + "\n", "")}\n\n${closing}`,
          };
        }

        return v;
      })
    );
    setMemoLoadingMemberId(null);
  };

  const setMessage = (memberId: number, message: string) => {
    setVipForms((prev) =>
      prev.map((v) => (v.member.id === memberId ? { ...v, message } : v))
    );
  };

  const submitAll = async (title: string) => {
    if (isSubmitting) {
      return;
    }

    setSubmitting(true);
    for (const form of vipForms) {
      if (form.submitted || form.submitting) {
        continue;
      }
      if (form.latestMemo.memo.includes(title)) {
        await submit(title, form.member.id, false);
      }
    }
    setSubmitting(false);
    message.success("일괄전송되었습니다.");
  };

  const submit = async (title: string, memberId: number, noti = true) => {
    try {
      setVipForms((prev) =>
        prev.map((v) =>
          v.member.id === memberId ? { ...v, submitting: true } : v
        )
      );
      const form = vipForms.find((v) => v.member.id === memberId);
      await StudioMateService.sendMessage(
        memberId,
        title,
        form.message,
        accessToken
      );
      setVipForms((prev) =>
        prev.map((v) =>
          v.member.id === memberId
            ? { ...v, submitting: false, submitted: true }
            : v
        )
      );
      if (noti) {
        message.success(`${form.member.name}쌤 - 전송되었습니다.`);
      }
    } catch {
      const form = vipForms.find((v) => v.member.id === memberId);
      message.error(`${form.member.name}쌤 - 전송 실패했습니다.`);
      setVipForms((prev) =>
        prev.map((v) =>
          v.member.id === memberId ? { ...v, submitting: false } : v
        )
      );
    }
  };

  return {
    vipForms,
    isEmpty,
    isLoadingMemo,
    loadMemo,
    setMessage,
    submitAll,
    submit,
    isSubmitting,
    memoLoadingMemberId,
  };
};
