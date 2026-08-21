import Markdown from 'react-markdown';

function TestPage() {
    const markdown = "```tsx import ReactMarkdown from react-markdown import remarkGfm from remark-gfm; // Supports strikethrough, task lists, etc. // Types for the code component interface CodeProps { children: React.ReactNode; className?: string; inline?: boolean;}```"
  return (
    <Markdown>{markdown}</Markdown>
  );
}

export default TestPage;