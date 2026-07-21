import Image from 'next/image';
import { CodeBlock } from './code-block';
import { MDXComponents } from 'mdx/types';

export function slugify(text: string) {
  return text.toString().toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');
}

export const components: MDXComponents = {
  h2: ({ children }) => {
    const text = children?.toString() || '';
    return <h2 id={slugify(text)} className="scroll-m-24">{children}</h2>;
  },
  h3: ({ children }) => {
    const text = children?.toString() || '';
    return <h3 id={slugify(text)} className="scroll-m-24">{children}</h3>;
  },
  img: (props) => {
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
    const src = props.src?.startsWith('/') ? `${basePath}${props.src}` : (props.src || '');

    return (
      <span className="block w-full my-8 rounded-xl overflow-hidden shadow-lg border border-divider bg-content2">
        <img 
          {...props as any}
          src={src}
          alt={props.alt || 'Article Image'}
          className="w-full h-auto object-contain"
        />
      </span>
    );
  },
  pre: (props) => {
    return <CodeBlock {...props} />;
  }
};
