# rose-ember-forge.github.io

Hi, I'm Raghunandan Rajkumar. This is the source of my portfolio site, live at
<https://rose-ember-forge.github.io>.

I'm a physicist turned data scientist, based in Stockholm. I take messy, real-world data and try to get
clear, useful answers out of it. The site is where I show that work.

## What's on the site

Three data projects, each with its own repository:

- **What do Swedish employers ask data people for?** Ten years of job ads from Arbetsförmedlingen,
  and how the skills asked of data people have shifted.
  [Skill-Trends-in-Data-Jobs-in-Sweden](https://github.com/rose-ember-forge/Skill-Trends-in-Data-Jobs-in-Sweden)
- **Forecasting tomorrow's electricity price in Stockholm.** Day-ahead price forecasts for SE3,
  back-tested on a full year, with a live forecast updated daily.
  [Forecasting-Electricity-Prices-in-Stockholm](https://github.com/rose-ember-forge/Forecasting-Electricity-Prices-in-Stockholm)
- **Why is my SL bus late?** A year of Stockholm public transport rebuilt from SL's real-time feed,
  and a model that predicts delays better than SL's own.
  [SL-Delays](https://github.com/rose-ember-forge/SL-Delays)

There is also some earlier work from my research years (a master's thesis on the Greenland Ice Sheet,
a published paper on emotion recognition from EEG), a short About section, and my CV as a PDF.

## How it's built

I wanted something simple to maintain that still felt like mine, so:

- The site is written in [Quarto](https://quarto.org), mostly one page (`index.qmd`).
- The look is my own SCSS on top of Bootstrap: black, red and grey, with light and dark modes.
- Type is IBM Plex (Serif for headings, Sans for text, Mono for details), with Alegreya SC for the mottos.
- The opening screen plays a short ECG heartbeat with three mottos I try to live by:
  *Semper Verus, Semper Fidus, Semper Discens* (always true, always faithful, always learning).
  Click my picture to see it again.
- It is hosted on GitHub Pages and deployed by a GitHub Actions workflow whenever `main` changes.

## How I work on it

`main` is the live site, so I keep it stable. Changes go on a `workshop` branch first, and reach `main`
only through a pull request. A build check renders the whole site on every pull request, so a broken
build never makes it to the live page.

## Running it locally

With [Quarto](https://quarto.org/docs/get-started/) installed:

```bash
quarto preview
```

## Get in touch

The fastest way to reach me is through the [contact section](https://rose-ember-forge.github.io/#contact)
of the site, or on [LinkedIn](https://www.linkedin.com/in/raghunandan-rajkumar/).
