
import Head from "next/head";
import Body from "../components/layouts/Body";
import styled from "styled-components";

const BigTitle = styled.h2`
  font-size: 3rem;
  text-align: center;
  color: #333;
  margin: 0;
`;

export default function Home() {
  return (
    <Body>
      <Head>
        <title>Nekos</title>
        <meta name="description" content="Nekos' Zone" />
        <link rel="icon" href="/favicon.gif" />
      </Head>
      <BigTitle>Fire!!</BigTitle>
    </Body>
  );
}