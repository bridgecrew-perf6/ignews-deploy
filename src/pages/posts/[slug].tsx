import * as prismicH from '@prismicio/helpers'
import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import Head from 'next/head'

import { createClient } from '../../../prismicio'
import styles from './post.module.scss'

interface PostProps {
  post: {
    slug: string
    title: string
    content: any
    updatedAt: string
  }
}

const Post = ({ post }: PostProps) => {
  return (
    <>
      <Head>
        <title>{post.title} | Ignews</title>
      </Head>

      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{post.title}</h1>
          <time>{post.updatedAt}</time>
          <div
            dangerouslySetInnerHTML={{ __html: prismicH.asHTML(post.content) }}
            className={styles.postContent}
          />
        </article>
      </main>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  params
}) => {
  const session = await getSession({ req })

  const { slug } = params

  if (!session?.activeSubscription) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  const prismic = createClient(req)

  const response = await prismic.getByUID('post-id', slug.toString(), {})

  const post = {
    slug,
    title: prismicH.asText(response.data.title),
    content: response.data.content,
    updatedAt: new Date(response.last_publication_date).toLocaleDateString(
      'pt-BR',
      {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      }
    )
  }

  return {
    props: {
      post
    }
  }
}

export default Post
