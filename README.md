# Convaudit

22 free browser-based tools for images, PDFs, and YouTube — no uploads, no sign-up.

[![Next.js](https://img.shields.io/badge/Next.js-App_Router-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Deploy with Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://vercel.com/)

**Live site:** [www.convaudit.com](https://www.convaudit.com)

## Why Convaudit?

- Quickly handle common image, PDF, and YouTube creator tasks in one place.
- Image and PDF file operations run locally in your browser; those files are not sent to Convaudit for processing.
- No account is required to use the tools.
- Tool pages explain how inputs are handled so you can make an informed choice.

## Features

### Image

- Compress images
- Remove image metadata (EXIF)

### PDF

- Merge and split PDF files
- Compress PDFs
- Convert images to PDF
- Render PDF pages as images

### Conversion

- Convert HEIC to JPG
- Convert WebP to PNG, PNG to JPG, and JPG to WebP
- Convert PDF to Word

### YouTube

- Download, resize, and test thumbnails
- Extract video tags
- Generate titles, descriptions, and hashtags
- Estimate channel earnings
- Find channel IDs
- Create timestamp links

## Tech stack

- **Framework:** Next.js App Router and React
- **Language:** TypeScript
- **Styling and UI:** Tailwind CSS, Radix UI, and Lucide
- **Image and document processing:** Canvas APIs, browser image libraries, `pdf-lib`, and PDF.js
- **Data layer:** Prisma and SQLite
- **Deployment:** Vercel

## Getting started

Requirements: Node.js 20.9 or newer and npm.

```bash
git clone https://github.com/namex308-stack/convaudit.git
cd convaudit
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The example environment values are placeholders; configure them for any integrations you enable. Never commit local environment files or real credentials.

## Project structure

```text
content/                 Blog content
prisma/                  Prisma schema and migrations
public/                  Static assets
src/
  app/                   Next.js App Router pages and API routes
  components/            Shared UI and tool components
  lib/                   Tool definitions and application helpers
tests/                   Tests
```

## Privacy

Image and PDF files handled by browser-based tools are processed locally and are not uploaded to Convaudit for those operations. Some YouTube tools request public information from YouTube or other services, and the YouTube Tags Extractor sends the video URL to the Convaudit server to retrieve public video-page data. Review the disclosure on each tool and the [privacy policy](https://www.convaudit.com/privacy) before use.

## Contributing

Bug reports, feature ideas, and pull requests are welcome. See the [contribution guide](CONTRIBUTING.md) before submitting.

## License

This project is licensed under the [MIT License](LICENSE).
