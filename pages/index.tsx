import { Button } from "antd";
import styled from "styled-components";

import { Greeting } from "@/components";

export default function HomePage() {
  return (
    <Main>
      <Greeting />
      <Button>하이하이</Button>
    </Main>
  );
}

const Main = styled.main`
  width: 100%;
  padding: 24px;
`;
