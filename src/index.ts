import Prism from 'prismjs'
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-markup';
import 'prismjs/themes/prism-solarizedlight.css'
import 'prismjs/plugins/line-numbers/prism-line-numbers.min'
import 'prismjs/plugins/line-numbers/prism-line-numbers.css'


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
        || `ERROR: Extraction tag ${tag} not found in code`
}

Prism.hooks.add('before-sanity-check', (env) => {
    env.code = (env.element as HTMLElement).innerText;
});

// complete file

const spec = {
    url: 'https://raw.githubusercontent.com/wwerner/bashplate/master/src/index.tsx',
    lang: 'typescript'
}
fetchCode(spec.url)
    .then(src => document.getElementById('src')!.innerText = src)
    .then(() => document.getElementById('src')?.classList.add(`language-${spec.lang}`))
    .then(() => Prism.highlightAll())

    // or with section tag
// fetchTaggedCode('https://raw.githubusercontent.com/actyx-contrib/react-pond/master/tsconfig.json', 'A').then(console.log)