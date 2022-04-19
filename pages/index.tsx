import { Button } from "antd";
import styled from "styled-components";

export default function HomePage() {
  return (
    <Main>
      <h1>
        Welcome to <a href="https://nextjs.org">Next.js!</a>
      </h1>
      <Button>하이하이</Button>
    </Main>
  );
}

const Main = styled.main`
  width: 100%;
  padding: 24px;
`;
