# Highlight-Embed

`highlight-embed` allows for grabbing sources from GitHub, renders and highlights them.
We use it to embed code snippets in tutorials and online courses.

The appliciation is hosted using Github Pages.

## Usage

You can specify the the file to fetch and render using URL query parameters:

// [[start:params]]
* `url` - The URL to pull the sources from. If you use a GitHub source URL (`https://github.com/<user>/<repo>/blob/<branch>/<path>`).
Will be transformed to the corresponding raw source URL (`https://raw.githubusercontent.com/<user>/<repo>/<branch>/<path>`).
Note that `raw.githubusercontent` invalidates caches only every 5 minutes.

* `lang` - The language used to parse and highlight the code.
Currently, we support HTML, CSS, JS (`markup`) TS (`typescript`), Markdown (`markdown`), Bash/Shell (`shell`), Powershell (`powershell`) and diff (`diff`). To format a diff snippet, you need to use `diff-<language>`.


* [optional] `tag` - The tag used for extracting parts of the source file. 
Use `// [[start:<tag>]]`👆 and `// [[end:<tag>]]`👇 in a comment the source.  

* [optional] `highlight` - Line numbers to highlight. 
Supports single lines (`5`), ranges (`1-3`) and combinations of those separated by `,` (`1, 2-4, 7`)
If you use the same tag multiple times, the extracted snippets will be joined using `...`.
// [[end:params]].

Example: https://wwerner.github.io/highlight-embed/?url=https://github.com/wwerner/highlight-embed/blob/main/README.md&lang=markdown&highlight=1,3-4&tag=params

### Embedding

In openEdX, simply use a `Raw HTML` unit and embed it either as iframe from a hosted version or include the script directly.

### script

[[start:embed-script]]
Upload the script from `dist/` to your courses content. Afterwards you can use it anywhere in the course.

In a `Raw HTML` unit,

* add a `div` to include the snippet into
* include the `embed.js` script
* include the `embed.css` styles
* define the params for the include
* call `embed` with these params

```
<link rel="stylesheet" href="embed.css">
<script src="embed.js"></script>
<div id="src-block"></div>

<script>
 embedSnippet(
    {
        containerId: 'src-block',
        url: 'https://github.com/wwerner/highlight-embed/blob/main/README.md',
        lang: 'typescript',
        tag: 'foo',
        highlight: '2,3-5'
    }
 )
</script>
```
[[start:embed-script]]

#### iframe
Simply use a `Raw HTML` block and embed the snippet using an iframe:
```
<iframe width='100%' height='350' src='https://wwerner.github.io/highlight-embed/?url=https://github.com/wwerner/highlight-embed/blob/main/README.md&lang=markdown&highlight=1,3-4&tag=params'></iframe>
```

## Development

* `yarn dev` to build, run and watch locally
* `yarn build` to build distribution package

Pushing onto `main` triggers the build and deployment to the `gh-pages` branches root.

To update the version used in openEdX, run `yarn build`, rename the JS and CSS output files to `embed.(css|js)` and upload them to the course's content.