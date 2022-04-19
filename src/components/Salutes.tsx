import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { Alert, Button, Card, message, Typography } from "antd";
import styled from "styled-components";

import { UpstashService } from "@/services";
import { closingsState, greetingsState } from "@/store";

const { Title, Paragraph } = Typography;

function SaluteCard({
  children,
  onRemove,
}: {
  children: string;
  onRemove: () => void;
}) {
  return (
    <CardWrapper>
      <Button danger onClick={onRemove}>
        삭제
      </Button>
      <Paragraph>{children}</Paragraph>
    </CardWrapper>
  );
}

export function Salutes() {
  const [greetings, setGreetings] = useRecoilState(greetingsState);
  const [closings, setClosings] = useRecoilState(closingsState);

  const init = async () => {
    const _greetings = await UpstashService.greetings();
    setGreetings(_greetings);
    const _closings = await UpstashService.closings();
    setClosings(_closings);
  };

  const add = (type: "greeting" | "closing") => async () => {
    const text = prompt(
      `추가할 ${type === "greeting" ? "인사말" : "맺음말"}을 입력해주세요.`
    );
    if (!text) {
      return;
    }

    if (type === "greeting") {
      const newGreetings = [...greetings, text];
      await UpstashService.saveGreetings(newGreetings);
      setGreetings(newGreetings);
    } else {
      const newClosings = [...closings, text];
      await UpstashService.saveClosings(newClosings);
      setClosings(newClosings);
    }

    message.success("추가되었습니다.");
  };

  const remove = (type: "greeting" | "closing") => async (index: number) => {
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
      <Row>
        <Title level={3}>인사말</Title>
        <Button onClick={add("greeting")}>추가</Button>
      </Row>
      {greetings.length === 0 && (
        <Alert
          message="인사말을 1개 이상 추가해주세요"
          type="warning"
          showIcon
        />
      )}
      {greetings.map((v, i) => (
        <SaluteCard key={v} onRemove={() => remove("greeting")(i)}>
          {v}
        </SaluteCard>
      ))}
      <Row>
        <Title level={3}>맺음말</Title>
        <Button onClick={add("closing")}>추가</Button>
      </Row>
      {closings.length === 0 && (
        <Alert
          message="맺음말을 1개 이상 추가해주세요"
          type="warning"
          showIcon
        />
      )}
      {closings.map((v, i) => (
        <SaluteCard key={v} onRemove={() => remove("closing")(i)}>
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
