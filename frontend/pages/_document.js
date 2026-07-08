import Document, { Html, Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Parisienne&family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
          <meta name="description" content="PILATEA — a tea-infused Pilates sanctuary blending movement, mindfulness, and matcha in an intimate real-home setting. Private & small-group reformer Pilates + artisan tea." />
          <meta name="keywords" content="pilates, tea, wellness, reformer pilates, matcha, studio, mindfulness, private pilates" />
          <meta name="author" content="PILATEA" />
          <meta property="og:title" content="PILATEA — Sip. Stretch. Glow." />
          <meta property="og:description" content="Where Pilates meets Tea — a wellness sanctuary in an intimate real-home setting." />
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://pilatea.com" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="PILATEA — Sip. Stretch. Glow." />
          <meta name="twitter:description" content="Where Pilates meets Tea — a wellness sanctuary in an intimate real-home setting." />
          <link rel="icon" type="image/png" href="/Untitled.png" />
          <link rel="apple-touch-icon" href="/Untitled.png" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
