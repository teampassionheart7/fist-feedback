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
  titleState,
} from "@/store";
import { Member } from "@/types";
import {
  getSubmitableMemo,
  isSubmitableForm,
} from "@/helpers/vip-form.helpers";

export const useVipForms = () => {
  const accessToken = useRecoilValue(accessTokenState);

  const title = useRecoilValue(titleState);
  const vips = useRecoilValue(vipsState);
  const greetings = useRecoilValue(greetingsState);
  const closings = useRecoilValue(closingsState);

  const [vipForms, setVipForms] = useRecoilState(vipFormsState);

  const isEmpty = vipForms.length === 0;
  const isLoadingMemo =
    !isEmpty && vipForms.filter((v) => v.latestMemos === undefined).length > 0;
  const [isSubmitting, setSubmitting] = useState(false);
  const [memoLoadingMemberId, setMemoLoadingMemberId] = useState<number>(null);

  useEffect(() => {
    setVipForms(
      vips.map((v) => ({
        member: v,
        latestMemos: undefined,
        message: null,
        submitted: false,
        submitting: false,
      }))
    );
    loadMemos(vips);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vips.length]);

  useEffect(() => {
    if (!title?.length) {
      return;
    }

    setVipForms((prev) =>
      prev.map((v) => {
        const submitableMemo = getSubmitableMemo(v.latestMemos, title);
        if (submitableMemo != null) {
          // 원래 제목을 포함하지 않았으나 이제 포함하는 form들에 대해서
          const greeting = [...greetings].sort(() => Math.random() - 0.5)[0];
          const closing = [...closings].sort(() => Math.random() - 0.5)[0];
          const firstname = v.member.profile.name.slice(1);

          return {
            ...v,
            message: `${firstname}${greeting}\n\n${submitableMemo.memo
              .replace(/^(\<\d+월\s.+\s주\s피드백\>\n)/, "")
              .replace(firstname + "\n", "")}\n\n${closing}`,
          };
        }
        if (submitableMemo == null) {
          // 원래 제목을 포함했으나 이제 포함하지 않는 경우
          return {
            ...v,
            message: "",
          };
        }
        return v;
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title]);

  const loadMemos = async (members: Member[]) => {
    for (const member of members) {
      await loadMemo(member.id);
    }
  };

  /** 메모와, 인사말/맺음말을 조합해 각 메세지를 설정합니다.  */
  const loadMemo = async (memberId: number) => {
    setMemoLoadingMemberId(memberId);
    const memos = await StudioMateService.getMemos(memberId, accessToken!);

    const greeting = [...greetings].sort(() => Math.random() - 0.5)[0];
    const closing = [...closings].sort(() => Math.random() - 0.5)[0];

    setVipForms((prev) =>
      prev.map((v) => {
        if (v.member.id === memberId) {
          const firstname = v.member.profile.name.slice(1);

          const submitableMemo = getSubmitableMemo(memos, title);

          return {
            ...v,
            latestMemos: memos.slice(0, 2),
            message: submitableMemo
              ? `${firstname}${greeting}\n\n${submitableMemo.memo
                  .replace(/^(\<\d+월\s.+\s주\s피드백\>\n)/, "")
                  .replace(firstname + "\n", "")}\n\n${closing}`
              : "",
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
      if (isSubmitableForm(form)(title)) {
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
        message.success(`${form.member.profile.name}쌤 - 전송되었습니다.`);
      }
    } catch {
      const form = vipForms.find((v) => v.member.id === memberId);
      message.error(`${form.member.profile.name}쌤 - 전송 실패했습니다.`);
      setVipForms((prev) =>
        prev.map((v) =>
          v.member.id === memberId ? { ...v, submitting: false } : v
        )
      );
    }
  };

  const addMemo = async (memberId: number, text: string) => {
    await StudioMateService.createMemo(memberId, text, accessToken);
    await loadMemo(memberId);
  };

  const updateMemo = async (memoId: number, text: string) => {
    const { ref_id } = await StudioMateService.updateMemo(
      memoId,
      text,
      accessToken
    );
    await loadMemo(ref_id);
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
    addMemo,
    updateMemo,
  };
};
