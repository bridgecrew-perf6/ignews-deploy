import * as prismic from '@prismicio/client'
import sm from './sm.json'

export const endpoint = sm.apiEndpoint
export const repositoryName = prismic.getRepositoryName(endpoint)



// This factory function allows smooth preview setup
export function createClient() {
  const client = prismic.createClient(endpoint, {
    accessToken: process.env.PRISMIC_ACCESS_TOKEN
  })

  return client
}