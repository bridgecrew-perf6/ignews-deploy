import { render, screen } from '@testing-library/react'
import { mocked } from 'jest-mock'
import { getSession, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

import { createClient } from '../../../prismicio'
import Post, { getStaticProps } from '../../pages/posts/preview/[slug]'
import { stripe } from '../../services/stripe'

const post = {
  slug: 'my-new-posts',
  title: 'my new post',
  content: '<p>my new post description</p>',
  updatedAt: '10 de Abril'
}

jest.mock('../../../prismicio.js')
jest.mock('next-auth/react')
jest.mock('next/router')

describe('PostPreviewPage', () => {
  it('renders correctly', () => {
    const useSessionMocked = mocked(useSession)

    useSessionMocked.mockReturnValueOnce({
      data: null,
      status: 'unauthenticated'
    })
    render(<Post post={post} />)
    expect(screen.getByText('my new post')).toBeInTheDocument()
    expect(screen.getByText('my new post description')).toBeInTheDocument()
    expect(screen.getByText('Wanna continue reading?')).toBeInTheDocument()
  })

  it('redirects user to full post when user is subscribed', async () => {
    const useRouterMocked = mocked(useRouter)
    const useSessionMocked = mocked(useSession)
    const pushMock = jest.fn()

    useSessionMocked.mockReturnValueOnce({
      data: {
        user: {
          name: 'John Doe',
          email: 'any@any.com'
        },
        activeSubscription: 'fake-subscription',
        expires: '123131'
      },
      status: 'authenticated'
    })

    useRouterMocked.mockReturnValueOnce({
      push: pushMock
    } as any)

    render(<Post post={post} />)

    expect(pushMock).toHaveBeenCalledWith('/posts/my-new-posts')
  })

  it('loads inital data', async () => {
    const createClientMocked = mocked(createClient)

    createClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
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
              text: 'Post content'
            }
          ]
        },
        last_publication_date: '04-01-2022'
      })
    } as any)

    const response = await getStaticProps({
      params: {
        slug: 'my-new-posts'
      }
    } as any)

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post: {
            slug: 'my-new-posts',
            title: 'My new post',
            content: [
              {
                text: 'Post content',
                type: 'paragraph'
              }
            ],
            updatedAt: '01 de abril de 2022'
          }
        }
      })
    )
  })
})
