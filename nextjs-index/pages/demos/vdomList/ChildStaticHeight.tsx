import { useEffect, useLayoutEffect, useState } from "react";
import styled from "styled-components";

const childHeight = 30;
const Ctn = styled.div`
  width: 200px;
  height: 200px;
  position: relative;
  overflow: auto;
  background: #eee;
  .list-item {
    height: ${childHeight}px;
    line-height: ${childHeight}px;
    padding: 0 10px;
    &.list-item-odd {
      background-color: #ddd;
    }
  }
  .list-ctn {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    z-index: 2;
  }
  .list-placeHolder {
    position: relative;
    z-index: 1;
  }
`;

const List: React.FC = () => {
  const childrenLength = 1000;
  const showLength = Math.ceil(200 / childHeight);
  const [top, setTop] = useState(0);
  const [firstIndex, setFirstIndex] = useState(0);
  const [firstTop, setFirstTop] = useState(0);
  const [list] = useState(() => {
    return Array.from(Array(childrenLength)).map((_, index) => {
      return `List${index}`;
    });
  });
  const listRealHeight = childrenLength * childHeight;
  function scroll(event: any) {
    const scrollTop = event.target.scrollTop;
    setTop(scrollTop);
  }
  useLayoutEffect(() => {
    // 当滚动条变化时候，计算应该显示的dom
    if (top > 0) {
      console.log(top);
      let firstIndex = Math.floor(top / childHeight);
      let firstTop = top % childHeight;
      setFirstIndex(firstIndex);
      setFirstTop(firstTop);
    } else {
      setFirstIndex(0);
      setFirstTop(0);
    }
  }, [top]);
  return (
    <Ctn
      onScroll={(event) => {
        scroll(event);
      }}
    >
      <div
        className="list-placeHolder"
        style={{
          height: `${listRealHeight}px`,
        }}
      ></div>
      <ul
        className="list-ctn"
        style={{
          top: `${top}px`,
        }}
      >
        {list
          .slice(firstIndex, firstIndex + showLength + 2)
          .map((item, index) => {
            const realIndex = firstIndex + index;
            const className = `list-item list-item${realIndex} list-item-${
              realIndex % 2 === 0 ? "odd" : "even"
            }`;
            return (
              <li
                className={className}
                style={
                  index === 0
                    ? {
                        marginTop: `-${firstTop}px`,
                      }
                    : undefined
                }
                key={realIndex}
              >
                {item}
              </li>
            );
          })}
      </ul>
    </Ctn>
  );
};

export default List;
