import { Button } from "antd";
import { useRecoilValue } from "recoil";
import styled from "styled-components";

import { Greeting, Login } from "@/components";

import { accessTokenState } from "@/store";

export default function HomePage() {
  const accessToken = useRecoilValue(accessTokenState);

  return (
    <Main>
      <Greeting />
      {accessToken == null && <Login />}
      {accessToken != null && <>{accessToken}</>}
      <Button>하이하이</Button>
    </Main>
  );
}

const Main = styled.main`
  width: 100%;
  padding: 24px;
`;
