export type Product = {
  id: number
  name: string
  description: string
  price: string
  deadline: number
  address: string
  created_at: string
  tx_hash: string
}

export interface ProfileFetchedFromGraphQL {
  id: string
  ownedBy: string
  handle: string
  displayName: string
  coverPicture?: string
  picture?: string
  followers?: string
  bio?: string
}

export type LensSavedProfile = {
  id: string
  address: string
  handle: string
  display_name: string
  profile_picture: string
  cover_picture: string
  bio: string
  facts: string[]
}

export type GeneratedIdea = {
  product_name: string
  product_description: string
  product_price: number
  payment_type: string
  product_deadline: number
  inspired_by_publication_ids: string[]
}

export type ProductsAndServiceIdeas = {
  id: number
  from_handle: string
  to_handle: string
  products_and_services: any[]
}

export type ProductInList = {
  created_at: string
  created_by: string
  creator: {
    id: string
    address: string
    handle: string
    display_name: string
    profile_picture: string
  }
  deadline: number
  description: string
  id: number
  inspired_by_publication_ids: string[]
  name: string
  offered_by: string
  price: string
  targeted_to: string
  tx_hash: string
  updated_at: string
  payment_type: string
}
