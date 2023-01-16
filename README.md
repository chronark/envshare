<div align="center">
    <h1 align="center">EnvShare</h1>
    <h5>Share Environment Variables Securely</h5>
</div>

<div align="center">
  <a href="https://envshare.dev">envshare.dev</a>
</div>
<br/>

EnvShare is a simple tool to share environment variables securely. It uses **AES-CBC** to encrypt your data before sending it to the server. The encryption key never leaves your browser.


## Features

- **Shareable Links:** Share your environment variables securely by sending a link
- **End-to-End Encryption:** AES-CBC encryption is used to encrypt your data before sending it to the server
- **Limit number of reads:** Limit the number of times a link can be read
- **Auto Expire:** Automatically expire links and delete data after a certain time

<br/>



![](img/envshare.png)

## Built with
- [Next.js](https://nextjs.org)
- [tailwindcss](https://tailwindcss.com)
- Deployed on [Vercel](https://vercel.com)
- Data stored on [Upstash](https://upstash.com)



## Deploy your own

Detailed instructions can be found [here](https://envshare.dev/deploy)


All you need is a Redis database on Upstash and a Vercel account. Click the button below to clone and deploy:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?demo-title=EnvShare&demo-description=Simple%20Next.js%20%2B%20Upstash%20app%20to%20share%20environment%20variables%20securely%20using%20AES-CBC%20encryption.&demo-url=https%3A%2F%2Fenvshare.dev%2F&demo-image=%2F%2Fimages.ctfassets.net%2Fe5382hct74si%2F5SaFBHXp5FBFJbsTzVqIJ3%2Ff0f8382369b7642fd8103debb9025c11%2Fenvshare.png&project-name=EnvShare&repository-name=envshare&repository-url=https%3A%2F%2Fgithub.com%2Fchronark%2Fenvshare&from=templates&integration-ids=oac_V3R1GIpkoJorr6fqyiwdhl17) 
