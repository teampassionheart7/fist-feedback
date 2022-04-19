import { useRecoilValue } from "recoil";
import styled from "styled-components";

import { Greeting, Login, DateRange } from "@/components";

import { accessTokenState } from "@/store";

export default function HomePage() {
  const accessToken = useRecoilValue(accessTokenState);

  return (
    <Main>
      <Greeting />
      {accessToken == null && <Login />}
      {accessToken == null && (
        <>
          <DateRange />
        </>
      )}
    </Main>
  );
}

const Main = styled.main`
  width: 100%;
  padding: 24px;
`;
