import Body from "components/layouts/Body";
import Markdown from "components/Markdown";

const code = `
\`\`\`ts
    var a:number = 1;
    var b = 3;
    var c = 1;
    var d = 2;
\`\`\`
`

const Demo: React.FC<{
  blogs: Blog[];
}> = ({ blogs }) => {
  return (
    <Body>
      虚拟长列表
      <Markdown content={code}></Markdown>
    </Body>
  );
};

export default Demo;
