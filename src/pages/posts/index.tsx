import * as prismicH from '@prismicio/helpers'
import { GetStaticProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'

import { createClient } from '../../../prismicio'
import styles from './styles.module.scss'

type Post = {
  slug: string
  title: string
  excerpt: string
  updatedAt: string
}

interface PostsProps {
  posts: Post[]
}

export const Posts = ({ posts }: PostsProps) => {
  return (
    <>
      <Head>
        <title>Posts | Ignews</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          {posts.map(post => (
            <Link key={post.slug} href={`/posts/${post.slug}`}>
              <a>
                <time>{post.updatedAt}</time>
                <strong>{post.title}</strong>
                <p>{post.excerpt}</p>
              </a>
            </Link>
          ))}
        </div>
      </main>
    </>
  )
}

export default Posts

export const getStaticProps: GetStaticProps = async () => {
  const prismic = createClient()
  const response = await prismic.getAllByType('post-id', {
    pageSize: 100
  })

  const posts = response.map(post => {
    return {
      slug: post.uid,
      title: prismicH.asText(post.data.title),
      excerpt:
        post.data.content.find(content => content.type === 'paragraph')?.text ??
        '',
      updatedAt: new Date(post.last_publication_date).toLocaleDateString(
        'pt-BR',
        {
          day: '2-digit',
          month: 'long',
          year: 'numeric'
        }
      )
    }
  })

  return {
    props: { posts }
  }
}
