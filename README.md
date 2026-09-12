# Habitta · Find the right area before the right home

[Explore the live demo](https://imobiliario-seven.vercel.app/) · [Browse the source](src) · [Quiz scoring tests](src/lib/quiz/__tests__/scoring.test.ts)

![Habitta — A zona certa antes da casa certa](public/og-image.png)

Habitta is a web application for exploring where to live in Portugal's Lisbon metropolitan area. It brings together a lifestyle questionnaire, area recommendations and local guides so people can consider a neighbourhood before choosing a property.

The GitHub repository is named **Verso**; the application is branded **Habitta**.

## Project overview

The project connects a practical housing-search problem with a React interface, recommendation logic and a Supabase backend. The public demo is the quickest way to explore the product; the source links below highlight its implementation.

| Area | Implementation |
| --- | --- |
| Area discovery | Questionnaire, scoring logic and recommendation screens |
| Local information | Municipality and parish pages for the Lisbon metropolitan area |
| Editorial content | Buying guides and articles, including Markdown/MDX content |
| Accounts | Supabase authentication and account-related screens |
| Properties and conversations | Listing, detail and messaging code, backed by Supabase integrations |
| Search visibility | Metadata, sitemap generation and prerendered page shells |

**Status:** a portfolio project under development. The repository includes features at different stages of completion, including coming-soon pages. Backend features require a configured Supabase project; the live demo should not be treated as proof that every workflow is complete.

## Technology

React 19 · TypeScript · Vite · React Router · Tailwind CSS · Supabase · Markdown/MDX · Vitest · Vercel

## Explore the implementation

- [Application routes](src/App.tsx): page structure, lazy loading and protected routes.
- [Quiz logic](src/lib/quiz): questions, scoring and trade-offs.
- [Scoring tests](src/lib/quiz/__tests__/scoring.test.ts): examples covering different housing preferences.
- [Pages](src/pages) and [components](src/components): product screens and reusable interface elements.
- [Local datasets](src/data): area information used by the application.
- [Supabase integration](src/lib/supabase) and [migrations](supabase/migrations): persistence code and versioned database changes.
- [Build scripts](scripts): sitemap and static-shell generation.

## Run locally

Use Node.js 22.12+ and npm.

```sh
git clone https://github.com/goncalo-deus1/verso.git
cd verso
npm ci
cp .env.example .env.local
```

Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env.local` using your own Supabase project. The application checks for both values at startup. Review the migrations and integration types when configuring the backend; these instructions do not provision a complete hosted environment.

`VITE_WEB3FORMS_KEY` is optional and is used by the feedback form. Use only the Supabase public anonymous key in the frontend, never a service-role key.

```sh
npm run dev
```

Open the local URL printed by Vite.

## Development checks

```sh
npm test
npm run lint
npm run build
npm run preview
```

The build also runs the SSR build, sitemap generation and static-shell generation through the `postbuild` script. These commands describe the available checks, not a claim that every feature has been tested end to end.

## Project context

Maintained in [Gonçalo Deus's portfolio](https://github.com/goncalo-deus1). The implementation combines frontend development, content structure, recommendation logic and backend integration around a concrete product idea.
