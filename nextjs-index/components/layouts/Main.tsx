import styled, { CSSProperties } from "styled-components";

const Ctn = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;

export const Main: React.FC<{
  style?: CSSProperties | undefined;
  className?: string;
}> = ({ style, className, children }) => {
  return (
    <Ctn className={className} style={style}>
      {children}
    </Ctn>
  );
};

export default Main;
