import Prism from 'prismjs'
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-diff';
import 'prismjs/themes/prism-solarizedlight.css'
import 'prismjs/plugins/line-numbers/prism-line-numbers.min'
import 'prismjs/plugins/line-numbers/prism-line-numbers.css'
import 'prismjs/plugins/line-highlight/prism-line-highlight'
import 'prismjs/plugins/line-highlight/prism-line-highlight.css'
import 'prismjs/plugins/normalize-whitespace/prism-normalize-whitespace'


export const fetchCode = (rawUrl: string) => {
    if (!rawUrl.startsWith('https://')) throw new Error('Only https:// URL are supported')
    return fetch(rawUrl)
        .then((res) => res.body?.getReader())
        .then((reader) => reader?.read())
        .then((data) => data && data.value && new TextDecoder().decode(data.value))
}

export const fetchTaggedCode = (url: string, tag: string) =>
    fetchCode(url).then(extractTaggedCode(tag))


const tagPattern = /\[\[(start|end):\w+\]\]/
const tag = (type: ('start' | 'end'), classifier: string) => `[[${type}:${classifier}]]`
const startTag = (classifier: string) => tag('start', classifier)
const endTag = (classifier: string) => tag('end', classifier)


const extractTaggedCode = (tag: string) => (text: string | undefined = '') => {
    return text
        .split('\n')
        .map(line => {
            return {
                text: line,
                hasStartTag: line.includes(startTag(tag)),
                hasEndTag: line.includes(endTag(tag))
            }
        })
        .reduce((acc, line) => {
            acc.open = (line.hasStartTag || (acc.open && !line.hasEndTag));
            if (acc.open && !line.hasStartTag) acc.lines.push(line);
            return acc
        }, { open: false, lines: [] as {}[] })
        .lines
        //@ts-expect-error
        .map(l => l.text)
        .filter(line => !line.match(tagPattern))
        .join('\n')
        || text
}

Prism.hooks.add('before-sanity-check', (env) => {
    env.code = (env.element as HTMLElement).innerText;
});

const params = new URLSearchParams(window.location.search);
const spec = {
    url: params.get('url')?.replace('github.com', 'raw.githubusercontent.com').replace('blob/', '') || '',
    lang: params.get('lang'),
    tag: params.get('tag') || '',
    highlight: params.get('highlight'),
}

fetchTaggedCode(spec.url, spec.tag)
    .then(src => document.getElementById('src')!.innerText = src)
    .then(() => document.getElementById('container')?.classList.add(`language-${spec.lang}`))
    .then(() => { if (spec.highlight) document.getElementById('container')?.classList.add(`line-highlight`) })
    .then(() => { if (spec.highlight) document.getElementById('container')?.setAttribute('data-line', spec.highlight) })
    .then(() => Prism.highlightAll())

