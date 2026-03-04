'use client'

import React from 'react'
import { toast } from 'sonner'

function copyAnchorLink(id: string) {
  const url = `${window.location.origin}${window.location.pathname}#${id}`
  navigator.clipboard.writeText(url)
  toast('Link copied')
}

function makeHeading(Tag: 'h1' | 'h2' | 'h3' | 'h4') {
  return function Heading({
    id,
    children,
    ...props
  }: React.HTMLAttributes<HTMLHeadingElement>) {
    if (!id) return <Tag {...props}>{children}</Tag>
    return (
      <Tag
        id={id}
        className="group relative cursor-pointer"
        onClick={() => copyAnchorLink(id)}
        {...props}
      >
        <span
          className="absolute -left-5 opacity-0 group-hover:opacity-100 text-neutral-500 transition-opacity select-none"
          aria-hidden
        >
          #
        </span>
        {children}
      </Tag>
    )
  }
}

export const H1 = makeHeading('h1')
export const H2 = makeHeading('h2')
export const H3 = makeHeading('h3')
export const H4 = makeHeading('h4')
