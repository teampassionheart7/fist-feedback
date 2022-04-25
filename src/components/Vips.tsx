import { useRecoilState } from "recoil";
import { Button, Empty, Input, message, Spin, Tooltip } from "antd";
import styled from "styled-components";

import { useVipForms } from "@/hooks";
import { titleState } from "@/store";

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
  } = useVipForms();

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
                        {vipForms.filter((v) => v.latestMemo).length} /{" "}
                        {vipForms.length})
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
                  <MemoWrapper>{form.latestMemo.memo}</MemoWrapper>
                </td>
                <td>
                  <MessageArea
                    value={form.message}
                    onChange={(e) => setMessage(form.member.id, e.target.value)}
                    style={{
                      backgroundColor: form.latestMemo.memo.includes(title)
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
