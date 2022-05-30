import { render, screen } from '@testing-library/react'
import { mocked } from 'jest-mock'
import { useSession } from 'next-auth/react'

import { createClient } from '../../../prismicio'
import Posts, { getStaticProps } from '../../pages/posts'
import { stripe } from '../../services/stripe'

const posts = [
  {
    slug: 'my-new-posts',
    title: 'my new post',
    excerpt: 'my new post description',
    updatedAt: '10 de Abril'
  }
]

jest.mock('../../../prismicio.js')

describe('PostsPage', () => {
  it('renders correctly', () => {
    render(<Posts posts={posts} />)
    expect(screen.getByText('my new post')).toBeInTheDocument()
  })

  it('loads inital data', async () => {
    const createClientMocked = mocked(createClient)

    createClientMocked.mockReturnValueOnce({
      getAllByType: jest.fn().mockResolvedValueOnce([
        {
          uid: 'my-new-post',
          data: {
            title: [
              {
                type: 'heading',
                text: 'My new post'
              }
            ],
            content: [
              {
                type: 'paragraph',
                text: 'Post excerpt'
              }
            ]
          },
          last_publication_date: '04-01-2022'
        }
      ])
    } as any)

    const response = await getStaticProps({})

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          posts: [
            {
              slug: 'my-new-post',
              title: 'My new post',
              excerpt: 'Post excerpt',
              updatedAt: '01 de abril de 2022'
            }
          ]
        }
      })
    )
  })
})
