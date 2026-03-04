import { MDXRemote } from 'next-mdx-remote/rsc'
import { readFileSync } from 'fs'
import { join } from 'path'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'
import { H1, H2, H3, H4 } from './components/Headings'

export default function Home() {
  const source = readFileSync(
    join(process.cwd(), 'content', 'pr-review-style.md'),
    'utf8'
  )

  return (
    <MDXRemote
      source={source}
      components={{ h1: H1, h2: H2, h3: H3, h4: H4 }}
      options={{
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [
            rehypeSlug,
            [rehypePrettyCode, {
              theme: {
                dracula:   'dracula',
                solarized: 'solarized-dark',
                nord:      'nord',
                monokai:   'monokai',
              },
            }] as never,
          ],
        },
      }}
    />
  )
}
