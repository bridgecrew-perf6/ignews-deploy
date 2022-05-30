import { render, screen } from '@testing-library/react'
import { mocked } from 'jest-mock'
import { getSession, useSession } from 'next-auth/react'

import { createClient } from '../../../prismicio'
import Post, { getServerSideProps } from '../../pages/posts/[slug]'
import { stripe } from '../../services/stripe'

const post = {
  slug: 'my-new-posts',
  title: 'my new post',
  content: '<p>my new post description</p>',
  updatedAt: '10 de Abril'
}

jest.mock('../../../prismicio.js')
jest.mock('next-auth/react')

let getSessionMocked

describe('PostPage', () => {
  it('renders correctly', () => {
    render(<Post post={post} />)
    expect(screen.getByText('my new post')).toBeInTheDocument()
    expect(screen.getByText('my new post description')).toBeInTheDocument()
  })

  it('redirects user if no subscription is found', async () => {
    const getSessionMocked = mocked(getSession)

    getSessionMocked.mockResolvedValueOnce(null)

    const response = await getServerSideProps({
      params: {
        slug: 'my-new-post'
      }
    } as any)

    expect(response).toEqual(
      expect.objectContaining({
        redirect: expect.objectContaining({
          destination: '/'
        })
      })
    )
  })

  it('loads inital data', async () => {
    getSessionMocked = mocked(getSession)

    getSessionMocked.mockResolvedValueOnce({
      activeSubscription: 'fake-active-subscription'
    } as any)

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

    getSessionMocked = mocked(getSession)

    getSessionMocked.mockResolvedValueOnce(null)

    const response = await getServerSideProps({
      params: {
        slug: 'my-new-post'
      }
    } as any)

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post: {
            slug: 'my-new-post',
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
