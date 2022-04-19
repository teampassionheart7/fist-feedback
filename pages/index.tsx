import { useRecoilValue } from "recoil";
import styled from "styled-components";

import { Login, Salutes, DateRange, Vips } from "@/components";

import { accessTokenState } from "@/store";

export default function HomePage() {
  const accessToken = useRecoilValue(accessTokenState);

  return (
    <Main>
      {accessToken == null && <Login />}
      {accessToken != null && (
        <>
          <Salutes />
          <DateRange />
          <Vips />
        </>
      )}
    </Main>
  );
}

const Main = styled.main`
  width: 100%;
  padding: 24px;
`;
