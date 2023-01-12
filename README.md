<div align="center">
    <h1 align="center">EnvShare</h1>
    <h5>Share Environment Variables Securely</h5>
</div>

<div align="center">
  <a href="https://envshare.chronark.dev/">envshare.chronark.dev</a>
</div>
<br/>

EnvShare is a simple tool to share environment variables securely. It uses **AES-CBB** to encrypt your data before sending it to the server. The encryption key is never persisted.


## Features

- **Sharable Links:** Share your environment variables securely by sending a link
- **End-to-End Encryption:** AES-CBC encryption is used to encrypt your data before sending it to the server
- **Limit number of reads:** Limit the number of times a link can be read
- **Auto Expire:** Automatically expire links and delete data after a certain time

<br/>





## Built with
- [Next.js](https://nextjs.org)
- [tailwindcss](https://tailwindcss.com)
- Deployed on [Vercel](https://vercel.com)
- Data stored on [Upstash](https://upstash.com)
