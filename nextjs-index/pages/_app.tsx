import "styles/normalize.css";
import "styles/globals.css";
import "styles/nprogress.css";
import 'highlight.js/styles/tomorrow-night-bright.css';
import type { AppProps } from "next/app";
import { createGlobalStyle, ThemeProvider } from "styled-components";
import { useEffect } from "react";
import { useRouter } from "next/router";
import NProgress from "nprogress";

const theme = {
  main: "#5c9922",
  text: "#333",
};

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    router.events.on("routeChangeStart", () => {
      NProgress.start();
    });
    router.events.on("routeChangeComplete", () => {
      NProgress.done();
    });
    router.events.on("routeChangeError", () => {
      NProgress.done();
    });
  });

  return (
    <ThemeProvider theme={theme}>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;
