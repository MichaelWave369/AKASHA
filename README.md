# AKASHA // The Open Archive

An open-source, offline-first concept explorer inspired by the Akashic Records, with an interactive constellation, source-linked history, a personal reflection journal, and a separate hypothetical-possibilities layer.

**Live site (once Pages publishes):** https://michaelwave369.github.io/AKASHA/

> AKASHA does not claim to access a literal supernatural archive, verify past lives, read other minds, or predict the future. Documented information, personal interpretations, and hypothetical designs remain separated.

## Explore

- **Documented:** Historical concepts and public archives, with source links and provenance labels.
- **Reflections:** Journal dreams, ideas and impressions without treating them as independently verified history.
- **Possibilities:** Examine hypothetical scenarios and future designs without claiming certain prediction.
- Search, navigate the constellation by mouse, touch or keyboard, and add entries.
- Export/import entries as JSON, or delete individual and all local entries.

There are no trackers, cloud backend, external runtime dependencies, paid APIs or user accounts. Authored entries stay in this browser's local storage. **Storage is not encrypted**: do not enter sensitive information on shared devices.

## Run locally

Open [site/index.html](site/index.html) in a modern browser. Alternatively run the command below from the repository root, then visit http://localhost:8000/ :

    python -m http.server 8000 --directory site

## GitHub Actions and Pages

The workflow at [.github/workflows/ci-pages.yml](.github/workflows/ci-pages.yml) validates the viewer on pull requests and pushes to main with Node 22. After checks pass on main, it publishes only site/ via the GitHub Pages Actions integration. Pull requests validate but do not deploy.

In **Settings → Pages**, choose **Build and deployment → Source: GitHub Actions**. After a successful deployment, visit https://michaelwave369.github.io/AKASHA/.

Run checks locally with:

    node --test tests/*.test.mjs

No npm install is needed.

## Roadmap

- v0.1: Standalone constellation, source references, browser-only notes and import/export
- v0.2: Provenance-aware document graph, local search and source quality controls
- v0.3: User-owned encrypted vault, optional local AI retrieval
- v0.4: Accessible Quest 3 / WebXR Hall of Records with desktop fallback
- v0.5: Opt-in preregistered blinded-target research mode

[Research and technical blueprint](docs/DEEP_DIVE.md) • [License](LICENSE)

## Ground rules

Document claims need sources. Personal experiences are not automatically verified facts. Speculation must be labeled. Personal data stays local by default. No fabricated citations or unsupported supernatural-access claims.
