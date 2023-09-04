import MarkdownIt from 'markdown-it';
import LinkToArticle from '$components/LinkToArticle.svelte';

const md = new MarkdownIt();

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
