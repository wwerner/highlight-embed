# Highlight-Embed

`highlight-embed` allows for grabbing sources from GitHub, renders and highlights them.
We use it to embed code snippets in tutorials and online courses.

The appliciation is hosted using Github Pages.

## Usage

You can specify the the file to fetch and render using URL query parameters:

[[start:params]]
* `url` - The URL to pull the sources from. If you use a GitHub source URL (`https://github.com/<user>/<repo>/blob/<branch>/<path>`), it will be transformed to the corresponding raw source URL (`https://raw.githubusercontent.com/<user>/<repo>/<branch>/<path>`)
* `lang` - The language used to parse and highlight the code. Currently, we support HTML, CSS, JS, TS, Markdown and Shell. To format a patch snippet, you need to use `diff-<language>`
* [optional] `tag` - The tag used for extracting parts of the source file. Use `[[start:<tag>]]`👆 and `[[end:<tag>]]`👇 in a comment the source.  
* [optional] `highlight` - Line numbers to highlight. Supports single lines (`5`), ranges (`1-3`) and combinations of those separated by `,` (`1, 2-4, 7`)
[[end:params]]

## Development

* `yarn dev` to build, run and watch locally
* `yarn build` to build distribution package

Pushing onto `main` triggers the build and deployment to the `gh-pages` branches root.