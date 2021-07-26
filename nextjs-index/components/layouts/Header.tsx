import Link from "next/link";
import navs from "config/navs";
import styled from "styled-components";
import { useRouter } from "next/dist/client/router";

const padding = '10px';
const Nav = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: fixed;
  right: -${padding};
  top: 0;
  height: 100%;
  a {
    width: 60px;
    padding: 0 ${padding};
    display: block;
    background: #5c9922;
    color: #fff;
    height: 30px;
    line-height: 30px;
    font-size: 0.5rem;
    margin-bottom: 1px;
    border-radius: 5px 0 0 5px;
    opacity: 0.6;
    transition: all .3s;
    &:hover {
      opacity: 1;
      transform: translateX(-${padding});
    }
    &.active {
      opacity: 1;
    }
  }
`;

export default function () {
  const router = useRouter();
  return (
    <header>
      <Nav>
        {navs.map(({ id, path, name }) => {
          return (
            <Link href={path} key={id}>
              <a className={router.pathname === path ? "active" : ""}>{name}</a>
            </Link>
          );
        })}
      </Nav>
    </header>
  );
}
