'use client'

import React from 'react'

function copyAnchorLink(id: string) {
  const url = `${window.location.origin}${window.location.pathname}#${id}`
  navigator.clipboard.writeText(url)
}

function makeHeading(Tag: 'h1' | 'h2' | 'h3' | 'h4') {
  return function Heading({
    id,
    children,
    ...props
  }: React.HTMLAttributes<HTMLHeadingElement>) {
    if (!id) return <Tag {...props}>{children}</Tag>
    return (
      <Tag id={id} className="group flex items-baseline gap-2" {...props}>
        <a
          href={`#${id}`}
          onClick={() => copyAnchorLink(id)}
          className="opacity-0 group-hover:opacity-100 text-neutral-500 hover:text-neutral-300 transition-opacity no-underline font-normal shrink-0"
          aria-hidden
          tabIndex={-1}
        >
          #
        </a>
        <span>{children}</span>
      </Tag>
    )
  }
}

export const H1 = makeHeading('h1')
export const H2 = makeHeading('h2')
export const H3 = makeHeading('h3')
export const H4 = makeHeading('h4')
