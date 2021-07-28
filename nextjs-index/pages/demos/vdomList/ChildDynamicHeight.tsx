import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import styled from "styled-components";

const avgHeight = 30;
const Ctn = styled.div`
  width: 200px;
  height: 200px;
  position: relative;
  overflow: auto;
  background: #eee;
  .list-item {
    height: ${avgHeight}px;
    line-height: ${avgHeight}px;
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

type Data = {
  height: number;
  content: string;
  top: number;
};

function generateData(childrenLength: number) {
  return Array.from(Array(childrenLength)).map((_, index) => {
    return {
      height: 20 + Math.floor(Math.random() * 40),
      content: `List${index}`,
      top: 0,
    };
  });
}

function calRealHeight(data: Data[]) {
  return data.reduce((count, item) => {
    item.top = count;
    return count + item.height;
  }, 0);
}

function calIndex(
  scrollTop: number,
  data: Data[],
  start: number,
  end: number
): number {
  let midIndex = Math.floor((start + end) / 2);
  let midNode = data[midIndex];
  // console.log(midIndex,midNode,start,end,scrollTop)
  if (midNode.top <= scrollTop && scrollTop <= midNode.top + midNode.height) {
    return midIndex;
  } else if (scrollTop < midNode.top) {
    return calIndex(scrollTop, data, start, midIndex - 1);
  } else {
    return calIndex(scrollTop, data, midIndex + 1, end);
  }
}

const List: React.FC = () => {
  const childrenLength = 100000;
  const showLength = Math.ceil(200 / avgHeight);
  const [top, setTop] = useState(0);
  const [firstIndex, setFirstIndex] = useState(0);
  const [firstTop, setFirstTop] = useState(0);
  const [list, setList] = useState<Data[]>([]);
  const [listRealHeight, setListRealHeight] = useState(0);
  function scroll(event: any) {
    const scrollTop = parseInt(event.target.scrollTop);
    setTop(scrollTop);
    if (scrollTop > 0) {
      calFirstIndex(scrollTop, list);
    } else {
      setFirstIndex(0);
      setFirstTop(0);
    }
  }

  const calFirstIndex = (top: number, list: Data[]) => {
    let firstIndex = calIndex(top, list, 0, list.length - 1);
    let firstTop = top - list[firstIndex].top;
    setFirstIndex(firstIndex);
    setFirstTop(firstTop);
  };

  useEffect(() => {
    let list = generateData(childrenLength);
    setList(list);
    setListRealHeight(calRealHeight(list));
  }, []);
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
                style={{
                  height: `${item.height}px`,
                  lineHeight: `${item.height}px`,
                  marginTop: `-${index === 0 ? firstTop : 0}px`,
                }}
                key={realIndex}
              >
                {item.content}
              </li>
            );
          })}
      </ul>
    </Ctn>
  );
};

export default List;
