This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Community mailbox

The floating mailbox is available throughout the site. Messages and image attachments are stored in the Sanity `production` dataset and are publicly visible on the **Correo** tab and at `/correo`. Admin replies are protected by an HTTP-only signed session cookie.

Create `.env.local` in this project root with:

```env
SANITY_API_TOKEN=your_server_only_sanity_write_token
BUZON_ADMIN_PASSWORD=your_private_admin_password
BUZON_SESSION_SECRET=your_random_secret_of_at_least_32_characters
```

Keep these values out of source control and never use a `NEXT_PUBLIC_` prefix for them. Generate a session secret with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`. Configure the same variables in the deployment environment. The Sanity token is used only by server actions; use a token with the minimum permissions needed to create mailbox documents and upload image assets.

The `mailSubmission` schema is defined in `studio-wwlb-webpage/schemaTypes/MailSubmission.ts`. Start the Studio from `studio-wwlb-webpage` to inspect it locally, and deploy the Studio schema when ready so mailbox documents can also be managed there.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
