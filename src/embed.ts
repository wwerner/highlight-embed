import Prism from 'prismjs'
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-diff';
import 'prismjs/components/prism-powershell';
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
            if (line.hasStartTag && acc.lines.length) acc.lines.push({ text: "\n...\n" });
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

export type EmbedParams = {
    containerId: string,
    url: string,
    lang: string,
    tag: string,
    highlight: string,
}

const randomId = (length = 6) => Math.random().toString(20).substr(2, length)


export const embed = (params: EmbedParams) => {
    const preEl = document.createElement('pre')
    const codeEl = document.createElement('code')

    preEl.id = 'container-' + randomId()
    codeEl.id = 'src-' + randomId()

    preEl.classList.add(`language-${params.lang}`, 'line-numbers')
    preEl.style.whiteSpace = 'pre-wrap'
    if (params.highlight) {
        preEl.classList.add(`line-highlight`)
        preEl.setAttribute('data-line', params.highlight)
    }

    preEl.append(codeEl)

    params.url = params.url.replace('github.com', 'raw.githubusercontent.com').replace('blob/', '')
    fetchTaggedCode(params.url, params.tag)
        .then(src => codeEl.innerText = src)
        .then(() => document.getElementById('container')?.classList.add(`language-${params.lang}`))
        .then(() => document.getElementById(params.containerId)?.append(preEl))
        .then(() => Prism.highlightAll())
}
