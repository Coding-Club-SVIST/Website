import { Html, Head, Main, NextScript } from 'next/document';
export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <title>Coderride | SVIST</title>
        <meta name="description" content="A platform for coders to share their projects, skills and experiences." />
        <meta name="keywords" content="coderride, projects, skills, experiences, coding, developers, svist" />
        <meta name="author" content="SVIST" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#131C2E" />
        <meta property="og:title" content="Coderride | SVIST" />
        <meta property="og:description" content="A platform for coders to share their projects, skills and experiences." />
        <meta property="og:url" content="https://coderride.foo.ng" />
        <meta property="og:site_name" content="Coderride" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_US" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}