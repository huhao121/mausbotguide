# mausbotguide.com

Unofficial, hands-on guides for [OpenMausBot](https://github.com/milind-soni/OpenMausBot), in English and 简体中文.

> MausBot Guide is an independent community project and is not affiliated with Supamaus Software Private Limited.
> OpenMausBot, MausBot and the mascot are trademarks of their respective owner.

## Fix something

Spotted an outdated step or a broken link? Open an issue or a pull request — every page is a Markdown file under
[`src/content/docs/`](src/content/docs/) (English) and [`src/content/docs/zh/`](src/content/docs/zh/) (Chinese).

```bash
pnpm install
pnpm dev        # http://localhost:4321
pnpm check && pnpm build
```

## How this repo is run

- `main` is protected: changes land through pull requests that pass the **PR / check** job.
- Every merge to `main` is deployed to https://mausbotguide.com, smoke-tested, and rolled back automatically if the
  smoke test fails.
- Content is written in a separate workspace and arrives here as `publish:` pull requests. Accepted outside
  contributions are ported back, so they are kept on the next publish.
