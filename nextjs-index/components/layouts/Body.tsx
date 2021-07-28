import styled, { CSSProperties } from "styled-components";
import Header from "./Header";
import Main from "./Main";

const BodyStyle = styled.div`
  min-height: 100vh;
  height: 100vh;
  color: ${(props) => props.theme.text};
  overflow: auto;
  font-size: 0.88rem;
  line-height: 1.5;
`;

export const EmptyBody: React.FC<{
  style?: CSSProperties | undefined;
  className?: string;
}> = ({ style, className, children }) => {
  return (
    <BodyStyle className={className} style={style}>
      {children}
    </BodyStyle>
  );
};

const Body: React.FC<{
  style?: CSSProperties | undefined;
  className?: string;
}> = ({ style, className, children }) => {
  return (
    <EmptyBody className={className} style={style}>
      <Header />
      <Main>{children}</Main>
    </EmptyBody>
  );
};

export default Body;
