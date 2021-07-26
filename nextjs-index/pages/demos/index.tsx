import Body from "components/layouts/Body";
import Link from "next/link";
import demos from "config/demos";

const Demos: React.FC<{}> = () => {
  return (
    <Body>
      <ul>
        {demos.map(({ id, name, path }) => {
          return (
            <li key={id}>
              <Link href={path}>{name}</Link>
            </li>
          );
        })}
      </ul>
    </Body>
  );
};

export default Demos;
