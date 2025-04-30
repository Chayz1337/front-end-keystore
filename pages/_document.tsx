import { Html, Head, Main, NextScript } from 'next/document'

 
export default function Document() {
  return (
    <Html>
      <Head>
      <link rel='icon' href='/favicon.ico' sizes='any' type="image/x-com"/>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}