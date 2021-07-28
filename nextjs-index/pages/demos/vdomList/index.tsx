import Body from "components/layouts/Body";
import Markdown from "components/Markdown";

import ChildStaticHeight from "./ChildStaticHeight";
import ChildDynamicHeight from "./ChildDynamicHeight";

const Demo: React.FC<{
  blogs: Blog[];
}> = ({ blogs }) => {
  return (
    <Body>
      <Markdown
        content={`
## 虚拟长列表

需要滚动展示大量数据列表时，因为性能问题，不能直接全部渲染出来，使用滑动窗口，只展示看到的部分

#### 子项高度相同

- 1.获取容器高度\`ctnHeight\`，子项高度\`childHeight\`；
- 2.获取虚拟长列表的总高度：\`realHeight = childHeight * childrenLength\` 
- 3.获取滑动窗口可展示条数：\`showLength = Math.ceil(ctnHeight / childHeight)\`  
- 4.滑动窗口使用\`absolute\`定位，高度与容器高度相同 
- 5.添加一个高度为\`realHeight\`的占位div，用来撑开容器产生滚动条 
- 6.监听容器的\`scroll\`事件，获取\`scrollTop\`，给滑动窗口设置css\`top: scrollTop\`，使滑动窗口保持原地不动 
- 7.计算当前应该展示的子项，\`index = scrollTop / childHeight \`，要展示的子项\`showNodes = list.slice(index, index + showLength) \`
- 8.给渲染列表的第一个子项增加css\`marginTop = scrollTop % childHeight\`使滚动更加平滑 

`}
      ></Markdown>
      <ChildStaticHeight />
      <Markdown content={`
#### 子项高度不同，且已知

- 1.子项数据设置为\`{height: DynamicHeight, content: Content}\` 
- 2.由于数据太多，可先假设子项平均高度\`avgHeight\`，
- 3.虚拟长列表的总高度需要遍历子数据累加，计算之前，可以先使用\`avgHeight * childrenLength\`预先撑开容器

###### 难点：高效查找滑动窗口渲染的子节点

当然，可以遍历累加的方式，累加对比，暴力求解，但是不太现实。
所以这里，可以在计算虚拟列表总高度时，顺便记录每个节点相对总高度的top值；
\`\`\`js
const listRealHeight = data.reduce((count, item) => {
  item.top = count;
  return count + item.height;
}, 0);
\`\`\`
当\`scrollTop\`变化的时候，使用二分查找法来计算渲染的列表
`}></Markdown>
    <ChildDynamicHeight />
    </Body>
  );
};

export default Demo;
