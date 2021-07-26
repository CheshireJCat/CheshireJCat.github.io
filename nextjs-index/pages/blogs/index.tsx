import Body from "../../components/layouts/Body";
import { getSortedBlogsData } from "../../lib/blogs";
import Link from "next/link";

const BlogList: React.FC<{
  blogs: Blog[];
}> = ({ blogs }) => {
  return (
    <ul>
      {blogs.map(({ id, title, date }) => {
        return (
          <li key={id}>
            <Link href={`/blogs/${id}`}>{title}</Link>
            <br />
            {date}
          </li>
        );
      })}
    </ul>
  );
};

const Blogs: React.FC<{
  blogs: Blog[];
}> = ({ blogs }) => {
  return (
    <Body>
      <BlogList blogs={blogs}></BlogList>
    </Body>
  );
};

export default Blogs;

export async function getStaticProps() {
  const allBlogsData = getSortedBlogsData();
  return {
    props: {
      blogs: allBlogsData,
    },
  };
}
