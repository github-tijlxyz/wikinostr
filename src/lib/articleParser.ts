import MarkdownIt from 'markdown-it';
import LinkToArticle from '$components/LinkToArticle.svelte';
import plainText from 'markdown-it-plain-text';

const md = new MarkdownIt();
const mdTxt = new MarkdownIt().use(plainText);

export function parse(markdown: string) {
  let parsedMarkdown = md.render(markdown);

  parsedMarkdown = parsedMarkdown.replace(/\[\[(.*?)\]\]/g, (match: any, content: any) => {
    const container = document.createElement('span');

    const linkToArticle = new LinkToArticle({
      target: container,
      props: {
        content: content
      }
    });

    return container.outerHTML;
  });

  return parsedMarkdown;
}

export function parsePlainText(markdown: string) {
  mdTxt.render(markdown);

  /* @ts-ignore */ // markdown-it-plain-text doesnt have typescript support??
  let parsedText = mdTxt.plainText.replace(/\[\[(.*?)\]\]/g, (match: any, content: any) => {
    return content;
  });

  return parsedText;
}
