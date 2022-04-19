import styled from "styled-components";

export function Greeting() {
  return (
    <Wrapper>
      <h1>
        Welcome to <Em>FIST FEEDBACK!</Em>
      </h1>
      <ul>
        <li>
          스튜디오메이트 링크:{" "}
          <a href="https://fiststudio.studiomate.kr/">
            https://fiststudio.studiomate.kr/
          </a>
        </li>
      </ul>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  margin-bottom: 48px;
`;

const Em = styled.em`
  font-style: normal;
  color: #1890ff;
`;