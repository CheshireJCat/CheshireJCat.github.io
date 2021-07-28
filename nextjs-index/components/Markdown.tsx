import remark from "remark";
import html from "remark-html";
import highlight from "remark-highlight.js";
import { useEffect, useState } from "react";
import styled from "styled-components";

async function trankMd(content: string) {
  const processedContent = await remark()
    .use(highlight)
    .use(html)
    .process(content);
  return processedContent.toString();
}

const Markdown: React.FC<{
  content: string;
}> = ({ content,children }) => {
  const [res, setRes] = useState(content);
  useEffect(() => {
    async function run() {
      let hlRes = await trankMd(res);
      setRes(hlRes);
    }
    run();
  }, []);
  useEffect(() => {
    async function run() {
      let hlRes = await trankMd(content);
      setRes(hlRes);
    }
    run();
  }, [content]);
  return <Ctn dangerouslySetInnerHTML={{ __html: res || "" }} />;
};

const Ctn = styled.div`
  max-width: 1000px;
  margin: 20px auto;
`

export default Markdown;
