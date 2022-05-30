import { render, screen } from '@testing-library/react'
import { mocked } from 'jest-mock'
import { useSession } from 'next-auth/react'

import Home, { getStaticProps } from '../../pages'
import { stripe } from '../../services/stripe'

jest.mock('next-auth/react')
jest.mock('next/router')
jest.mock('../../services/stripe')
describe('HomePage', () => {
  it('renders correctly', () => {
    const useSessionMocked = mocked(useSession)

    useSessionMocked.mockReturnValueOnce({
      data: null,
      status: 'unauthenticated'
    })
    render(
      <Home product={{ priceId: 'fake-price-id', amount: 'any-amount' }} />
    )
    expect(screen.getByText(/any-amount/i)).toBeInTheDocument()
  })

  it('loads inital data', async () => {
    const retrieveStripePriceMocked = mocked(stripe.prices.retrieve)

    retrieveStripePriceMocked.mockResolvedValueOnce({
      id: 'fake-price-id',
      unit_amount: 1000
    } as any)

    const response = await getStaticProps({})
    expect(response).toEqual(
      expect.objectContaining({
        props: {
          product: {
            priceId: 'fake-price-id',
            amount: '$10.00'
          }
        }
      })
    )
  })
})
