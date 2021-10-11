import Document, { Head, Html, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link rel='shortcut icon' href='favicon.svg' type='image/svg' />
          <link rel='apple-touch-icon' href='favicon.svg'></link>

          <meta property='og:locale' content='pt_BR' />
          <meta property='og:type' content='website' />
          <meta property='og:site_name' content='AuthApp' />
          <meta property='og:image:type' content='image/svg' />
          <meta property='og:image:width' content='1200' />
          <meta property='og:image:height' content='630' />

          <meta name='twitter:card' content='summary_large_image' />
          <meta name='twitter:image:width' content='1200' />
          <meta name='twitter:image:height' content='620' />

          <title>Auth App</title>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
