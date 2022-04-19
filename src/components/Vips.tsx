import { Button, Empty, Spin } from "antd";
import styled from "styled-components";

import { useVipForms } from "@/hooks";

export function Vips() {
  const { vipForms, isEmpty, isLoadingMemo, setMessage } = useVipForms();

  return (
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
                <MemoWrapper>{form.latestMemo}</MemoWrapper>
              </td>
              <td>
                <MessageArea
                  value={form.message}
                  onChange={(e) => setMessage(form.member.id, e.target.value)}
                />
              </td>
              <td>
                <Button type="primary" disabled={form.submitted}>
                  전송
                </Button>
              </td>
            </tr>
          ))}
      </tbody>
    </Table>
  );
}

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

  white-space: pre-wrap;
`;

const MessageArea = styled.textarea`
  width: 540px;
  height: 360px;
  padding: 12px;

  background-color: white;
`;
