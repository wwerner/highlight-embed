import Prism from 'prismjs'
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-diff';
import 'prismjs/themes/prism-solarizedlight.css'
import 'prismjs/plugins/line-numbers/prism-line-numbers.min'
import 'prismjs/plugins/line-numbers/prism-line-numbers.css'
import 'prismjs/plugins/line-highlight/prism-line-highlight.min'
import 'prismjs/plugins/line-highlight/prism-line-highlight.css'


export const fetchCode = (rawUrl: string) => {
    return fetch(rawUrl)
        .then((res) => res.body?.getReader())
        .then((reader) => reader?.read())
        .then((data) => data && data.value && new TextDecoder().decode(data.value))
        .then((data) => data || `ERROR: Code not found at ${rawUrl}`)
}

export const fetchTaggedCode = (rawUrl: string, tag: string) =>
    fetchCode(rawUrl).then(extractTaggedCode(tag))

const cutOnEndTag = (tag: string) => (text: string) =>
    text.substr(0, text.indexOf(`// [[end:${tag}]]`))

const extractTaggedCode = (tag: string) => (text: string | undefined = '') => {
    return text
        .split(`// [[start:${tag}]]`)
        .slice(1)
        .map(cutOnEndTag(tag))
        .join('\n\n// [...]\n\n')
        || text
}

Prism.hooks.add('before-sanity-check', (env) => {
    env.code = (env.element as HTMLElement).innerText;
});


const params = new URLSearchParams(window.location.search);




const spec = {
    url: params.get('url')?.replace('github.com', 'raw.githubusercontent.com').replace('blob/', '') || '',
    lang: params.get('lang'),
    tag: params.get('tag'),
    highlight: params.get('highlight')
}

fetchTaggedCode(spec.url)
    .then(src => document.getElementById('src')!.innerText = src)
    .then(() => document.getElementById('container')?.classList.add(`language-${spec.lang}`))
    .then(() => { if (spec.highlight) document.getElementById('container')?.classList.add(`line-highlight`) })
    .then(() => { if (spec.highlight) document.getElementById('container')?.setAttribute('data-line', spec.highlight) })
    .then(() => Prism.highlightAll())

    // or with section tag
// fetchTaggedCode('https://raw.githubusercontent.com/actyx-contrib/react-pond/master/tsconfig.json', 'A').then(console.log)