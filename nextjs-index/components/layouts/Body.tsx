import styled, { CSSProperties } from "styled-components";
import Header from "./Header";

const BodyStyle = styled.div`
  min-height: 100vh;
  height: 100vh;
  color: ${(props) => props.theme.text};
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
      {children}
    </EmptyBody>
  );
};

export default Body;
