import ReactMarkdown from "react-markdown";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

type MarkdownGuideProps = {
  markdown: string;
};

export function MarkdownGuide({ markdown }: MarkdownGuideProps) {
  return (
    <article className="prose-rf">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug]}
        components={{
          table: ({ children }) => (
            <div className="table-wrap">
              <table>{children}</table>
            </div>
          ),
          a: ({ href, children }) => {
            const external =
              href?.startsWith("http") || href?.startsWith("//");
            if (external) {
              return (
                <a href={href} target="_blank" rel="noopener noreferrer">
                  {children}
                </a>
              );
            }
            return <a href={href}>{children}</a>;
          },
        }}
      >
        {markdown}
      </ReactMarkdown>
    </article>
  );
}
