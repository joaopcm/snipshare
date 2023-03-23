
![Logo](https://getnodepad.com/og.png)


# Nodepad

Revolutionize your coding experience with Nodepad - the all-in-one platform for creating, executing, and sharing Node.js code snippets! Join the coding revolution today at www.getnodepad.com 🚀🌟


## Motivation

Nodepad was built with the motivation to help programming students succeed in their studies and achieve their coding goals. As students ourselves, we understand the challenges that come with learning to code, from debugging errors to keeping track of notes and progress. We saw the need for a powerful and convenient platform that would streamline the coding process and make learning more accessible and enjoyable for everyone.

With Nodepad, programming students can benefit from a suite of features designed specifically for their needs. The ability to execute Node.js code snippets directly in the browser saves time and eliminates the hassle of setting up and deploying code. Easy-to-read Markdown allows for clear and concise note-taking and documentation, keeping students organized and focused on their studies.

But Nodepad is more than just a tool for individual students. As an open-source project, it is a community-driven effort to make coding more accessible and enjoyable for all. By contributing to Nodepad or using it in their studies, students can join a vibrant community of developers, students, and educators who share a passion for programming and a commitment to innovation and excellence.

At the heart of Nodepad is the belief that programming should be accessible to everyone, regardless of background or experience level. We hope that by providing a powerful, convenient, and community-driven platform for programming students, we can help inspire the next generation of great coders and contribute to a more inclusive and dynamic programming community.


## Features

- **Fully accessible through shortcuts**: Nodepad is designed to be fully accessible through shortcuts, allowing users to navigate and use the platform quickly and efficiently.

- **Markdown-based note-taking**: Nodepad allows users to write notes and documentation using easy-to-read Markdown syntax, making it simple to create and organize notes on programming concepts.

- **Node.js code execution**: With Nodepad, users can execute Node.js code snippets directly in their browser, providing real-time feedback and eliminating the need for complex setup or deployment processes.

- **Random link for secure sharing**: Users can share their notes and code snippets with secure, random links, ensuring that only authorized users can access their work. This feature also makes it easy to collaborate with others on programming projects.

- **Real-time feedback**: As users write and execute code, Nodepad provides real-time feedback and results, making it easy to test and debug code. This feature allows users to quickly iterate and improve their code.

Overall, Nodepad is a powerful and convenient platform for creating and sharing Node.js code snippets, with features designed to streamline the coding process and make it accessible to users of all levels.


## Tech Stack

**Client:** React.js, Next.js, TailwindCSS, TipTap, and WebContainers

**Server:** Node.js, MongoDB, and Redis


## Installation

Clone and run this project

```bash
  git clone git@github.com:joaopcm/nodepad.git
  cd ./nodepad
  pnpm install
  pnpm run dev
```

## Environment Variables

To run this project, you will need to add the following environment variables to your `.env.local` file

`MONGODB_URI` - We use MongoDB Atlas Free Tier for this

`DB_NAME`

`NEXT_PUBLIC_APP_URL` - This must be your app URL. If running locally, set this to http://localhost:3000

`REDIS_URL` - We use Upstash for the Redis database

`REDIS_TOKEN` - Provided by Upstash

`OPENAI_API_KEY` - We use OpenAI for the AI to explain code snippets
## Authors

- [@joaopcm](https://www.github.com/joaopcm)


## Roadmap

- [x] Add a welcome modal explaining the app when the user first visits (added a cool landing page)
- [ ] Support multiple code snippets per note
- [ ] Dynamic SEO meta tags
- [ ] Templates marketplace
- [x] AI to explain code snippets
- [x] Changelog
- [ ] User authentication so that users can create only private notes
- [ ] Groups, where users can add other users to collaborate on notes privately
- [x] Examples library
- [x] Keyboard shortcuts
- [x] Command palette
- [x] Keyboard shortcuts
- [x] Move this app to its own domain (getnodepad.com)

## Technical Debts

- [ ] Add tests
- [x] Render "view" instead of "views" when the counter is 1 (string, not number)
