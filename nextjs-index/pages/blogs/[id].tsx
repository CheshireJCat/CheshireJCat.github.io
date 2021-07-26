import type { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import Body from "../../components/layouts/Body";
import { getAllBlogIds, getBlogData } from "../../lib/blogs";

const BlogDetail: React.FC<{
  data: Blog;
}> = ({ data }) => {
  return (
    <Body>
      <Head>{data.title}</Head>
      {data.title}
      {data.date}
      <br />
      {data.id}
      <div dangerouslySetInnerHTML={{ __html: data.content || "" }} />
    </Body>
  );
};

export default BlogDetail;

export const getStaticPaths: GetStaticPaths = () => {
  const paths = getAllBlogIds();
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<
  {
    data: Blog;
  },
  {
    id: string;
  }
> = async (context) => {
  let { params } = context;
  let id = params?.id || "";
  const data = await getBlogData(id);
  return {
    props: {
      data,
    },
  };
};
