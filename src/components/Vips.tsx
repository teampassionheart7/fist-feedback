import { useState } from "react";
import { useRecoilState } from "recoil";
import { Button, Empty, Input, message, Modal, Spin, Tooltip } from "antd";
import styled from "styled-components";

import { isSubmitableForm } from "@/helpers";
import { useVipForms } from "@/hooks";
import { titleState } from "@/store";
import { Memo } from "@/types";

export function Vips() {
  const [title, setTitle] = useRecoilState(titleState);
  const {
    vipForms,
    isEmpty,
    isLoadingMemo,
    setMessage,
    submitAll,
    submit,
    isSubmitting,
    loadMemo,
    memoLoadingMemberId,
    addMemo,
    updateMemo,
  } = useVipForms();

  const [modalState, setModalState] = useState<{
    type: "add" | "edit";
    memberId: number;
    editId: number;
    isOpen: boolean;
    text: string;
  }>({
    type: null,
    memberId: null,
    editId: null,
    isOpen: false,
    text: null,
  });

  const open =
    (type: "add" | "edit", memberId: number, editMemo: Memo) => () => {
      setModalState({
        type,
        isOpen: true,
        memberId: memberId,
        editId: editMemo?.id ?? null,
        text: type === "add" ? "" : editMemo?.memo ?? "",
      });
    };
  const close = () => {
    setModalState({
      type: null,
      isOpen: false,
      text: null,
      editId: null,
      memberId: null,
    });
  };
  const handleModalTextChange = (text: string) => {
    setModalState((prev) => ({ ...prev, text }));
  };
  const ok = async () => {
    const { type, text } = modalState;

    if (!text) {
      message.warning("내용을 입력하세요.");
      return;
    }

    if (type === "add") {
      await addMemo(modalState.memberId, text);
    } else {
      await updateMemo(modalState.editId, text);
    }

    message.success("저장되었습니다.");
    close();
  };

  return (
    <>
      <Row>
        <Input
          placeholder="전송할 알림 제목을 입력해주세요."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: "264px" }}
        />
        <Tooltip title="입력한 제목을 메세지가 포함하는 건만 전송합니다.">
          <Button
            type="primary"
            onClick={() => submitAll(title)}
            disabled={!title || isEmpty || isLoadingMemo}
            loading={isSubmitting}
          >
            일괄전송
          </Button>
        </Tooltip>
      </Row>
      <Modal
        title="메모 추가/수정"
        visible={modalState.isOpen}
        onOk={ok}
        onCancel={close}
        okText="저장"
        cancelText="취소"
      >
        <Input.TextArea
          placeholder="내용을 입력하세요."
          value={modalState.text}
          style={{ height: "240px" }}
          onChange={(e) => handleModalTextChange(e.target.value)}
        />
      </Modal>
      <Table>
        <thead>
          <tr>
            <th>이름</th>
            <th>최신 피드백</th>
            <th>전송할 메세지</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {isEmpty ||
            (isLoadingMemo && (
              <tr>
                <td colSpan={3}>
                  <SymbolWrapper>
                    {isEmpty && (
                      <>
                        <Empty />
                        불러온 데이터가 없습니다.
                      </>
                    )}
                    {isLoadingMemo && (
                      <>
                        <Spin size="large" />
                        회원별 최신 메모를 불러오고 있습니다 ... (
                        {
                          vipForms.filter((v) => v.latestMemos != null).length
                        } / {vipForms.length})
                      </>
                    )}
                  </SymbolWrapper>
                </td>
              </tr>
            ))}
          {!isEmpty &&
            !isLoadingMemo &&
            vipForms.map((form) => (
              <tr key={form.member.id}>
                <td>{form.member.name}</td>
                <td>
                  <Row>
                    <Button
                      disabled={form.submitted || form.submitting}
                      loading={memoLoadingMemberId === form.member.id}
                      onClick={open("add", form.member.id, form.latestMemos[0])}
                    >
                      추가
                    </Button>
                    {form.latestMemos?.length > 0 && (
                      <Button
                        disabled={form.submitted || form.submitting}
                        loading={memoLoadingMemberId === form.member.id}
                        onClick={open(
                          "edit",
                          form.member.id,
                          form.latestMemos[0]
                        )}
                      >
                        수정
                      </Button>
                    )}
                    <Button
                      disabled={form.submitted || form.submitting}
                      loading={memoLoadingMemberId === form.member.id}
                      onClick={async () => {
                        await loadMemo(form.member.id);
                        message.success(
                          `${form.member.name} 회원님의 피드백을 불러왔습니다.`
                        );
                      }}
                    >
                      다시 불러오기
                    </Button>
                  </Row>
                  {form.latestMemos.map(({ memo }) => (
                    <MemoWrapper key={memo}>{memo}</MemoWrapper>
                  ))}
                </td>
                <td>
                  <MessageArea
                    value={form.message}
                    onChange={(e) => setMessage(form.member.id, e.target.value)}
                    style={{
                      backgroundColor: isSubmitableForm(form)(title)
                        ? "#d8f2bd"
                        : "#f0bba8",
                    }}
                  />
                </td>
                <td>
                  <Button
                    type="primary"
                    disabled={!title || form.submitted}
                    loading={isSubmitting || form.submitting}
                    onClick={() => submit(title, form.member.id, true)}
                  >
                    {form.submitted ? "전송됨" : "전송"}
                  </Button>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
    </>
  );
}

const Row = styled.div`
  display: flex;
  flex-direction: row;

  margin: 16px 0;

  & > * {
    margin-right: 16px;
  }
`;

const Table = styled.table`
  width: 100%;
  margin-top: 48px;

  border-collapse: collapse;

  th,
  td {
    padding: 12px 0 12px 12px;
    text-align: left;
    font-size: 14px;
  }

  & > thead {
    background-color: #fafafa;
    border: 1px solid #eaeaea;
    border-collapse: separate;
    border-spacing: 0;
    border-radius: 16px;

    th {
      font-weight: 400;
      color: #333;
    }
  }
  & > tbody {
    tr {
      border-bottom: 1px solid #eaeaea;
      td {
        color: #444;
        vertical-align: top;
      }

      transition: all 0.3s;
      &:hover {
        background-color: #fafafa;
      }
    }
  }
`;

const SymbolWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  width: 100%;
  height: 100%;
  padding: 48px;
`;

const MemoWrapper = styled.div`
  width: 540px;
  margin-top: 16px;

  white-space: pre-wrap;
`;

const MessageArea = styled.textarea`
  width: 540px;
  height: 360px;
  padding: 12px;

  background-color: white;
`;
