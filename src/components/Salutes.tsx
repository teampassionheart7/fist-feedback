import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { Alert, Button, Input, message, Modal, Typography } from "antd";
import styled from "styled-components";

import { UpstashService } from "@/services";
import { closingsState, greetingsState } from "@/store";

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

function SaluteCard({
  children,
  onEdit,
  onRemove,
}: {
  children: string;
  onEdit: () => void;
  onRemove: () => void;
}) {
  return (
    <CardWrapper>
      <Button onClick={onEdit}>수정</Button>
      <Button danger onClick={onRemove}>
        삭제
      </Button>
      <Paragraph style={{ whiteSpace: "pre-wrap" }}>{children}</Paragraph>
    </CardWrapper>
  );
}

export function Salutes() {
  const [greetings, setGreetings] = useRecoilState(greetingsState);
  const [closings, setClosings] = useRecoilState(closingsState);

  const [modalState, setModalState] = useState<{
    type: "greeting" | "closing";
    editIndex: number;
    isOpen: boolean;
    text: string;
  }>({
    type: null,
    editIndex: null,
    isOpen: false,
    text: null,
  });

  const open = (type: "greeting" | "closing", editIndex?: number) => () => {
    setModalState({
      type,
      isOpen: true,
      editIndex: editIndex ?? null,
      text:
        editIndex != null
          ? (type === "greeting" ? greetings : closings)[editIndex]
          : "",
    });
  };
  const close = () => {
    setModalState({ type: null, isOpen: false, text: null, editIndex: null });
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

    if (type === "greeting") {
      const editIndex = modalState.editIndex ?? greetings.length;

      const newGreetings = [
        ...greetings.slice(0, editIndex),
        text,
        ...greetings.slice(editIndex + 1),
      ];
      await UpstashService.saveGreetings(newGreetings);
      setGreetings(newGreetings);
    } else {
      const editIndex = modalState.editIndex ?? closings.length;
      const newClosings = [
        ...closings.slice(0, editIndex),
        text,
        ...closings.slice(editIndex + 1),
      ];
      await UpstashService.saveClosings(newClosings);
      setClosings(newClosings);
    }

    message.success("저장되었습니다.");
    close();
  };

  const init = async () => {
    const _greetings = await UpstashService.greetings();
    setGreetings(_greetings);
    const _closings = await UpstashService.closings();
    setClosings(_closings);
  };

  const remove = (type: "greeting" | "closing", index: number) => async () => {
    if (type === "greeting") {
      const newGreetings = greetings.filter((_, i) => i !== index);
      await UpstashService.saveGreetings(newGreetings);
      setGreetings(newGreetings);
    } else {
      const newClosings = closings.filter((_, i) => i !== index);
      await UpstashService.saveClosings(newClosings);
      setClosings(newClosings);
    }

    message.success("삭제되었습니다.");
  };

  useEffect(() => {
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Wrapper>
      <Modal
        title="추가/수정"
        visible={modalState.isOpen}
        onOk={ok}
        onCancel={close}
        okText="저장"
        cancelText="취소"
      >
        <TextArea
          placeholder="내용을 입력하세요."
          value={modalState.text}
          onChange={(e) => handleModalTextChange(e.target.value)}
        />
      </Modal>
      <Row>
        <Title level={3}>인사말</Title>
        <Button onClick={open("greeting")}>추가</Button>
      </Row>
      {greetings.length === 0 && (
        <Alert
          message="인사말을 1개 이상 추가해주세요"
          type="warning"
          showIcon
        />
      )}
      {greetings.map((v, i) => (
        <SaluteCard
          key={v}
          onEdit={open("greeting", i)}
          onRemove={remove("greeting", i)}
        >
          {v}
        </SaluteCard>
      ))}
      <Row>
        <Title level={3}>맺음말</Title>
        <Button onClick={open("closing")}>추가</Button>
      </Row>
      {closings.length === 0 && (
        <Alert
          message="맺음말을 1개 이상 추가해주세요"
          type="warning"
          showIcon
        />
      )}
      {closings.map((v, i) => (
        <SaluteCard
          key={v}
          onEdit={open("closing", i)}
          onRemove={remove("closing", i)}
        >
          {v}
        </SaluteCard>
      ))}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  margin-bottom: 48px;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;

  & > * {
    margin-right: 16px;
  }
`;

const CardWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  width: 100%;
  padding: 8px;

  & > * {
    margin-right: 16px;
  }
  & > div {
    margin-bottom: 0;
  }
`;
