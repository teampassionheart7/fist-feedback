import { useState } from "react";
import { useRecoilState } from "recoil";
import { Button, Input, message, Typography } from "antd";
import styled from "styled-components";

import { StudioMateService } from "@/services";
import { accessTokenState } from "@/store";

const { Title } = Typography;

export function Login() {
  const [_, setAccessToken] = useRecoilState(accessTokenState);

  const [identity, setIdentity] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setLoading] = useState(false);

  const login = async () => {
    if (isLoading) {
      return;
    }

    if (!identity || !password) {
      alert("ID/PW를 입력해주세요.");
      return;
    }

    try {
      setLoading(true);
      const token = await StudioMateService.login(identity, password);
      setAccessToken(token);
    } catch {
      message.error("스튜디오메이트 로그인에 실패했습니다.");
    } finally {
      message.success("스튜디오메이트 로그인이 완료되었습니다.");
      setLoading(false);
    }
  };

  return (
    <Wrapper>
      <Title level={3}>먼저 스튜디오메이트 계정정보를 입력해주세요.</Title>
      <Input
        placeholder="스튜디오메이트 ID"
        value={identity}
        onChange={(e) => setIdentity(e.target.value)}
      />
      <Input
        placeholder="스튜디오메이트 PW"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button type="primary" onClick={login}>
        스튜디오메이트 로그인
      </Button>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;

  width: 100%;
  max-width: 540px;

  & > * {
    margin-bottom: 12px;
  }
`;
