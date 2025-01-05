export const profileByHandle = `
  query GetProfileByHandle($handle: Handle!) {
    profile(request: { forHandle: $handle }) {
      id
      ownedBy {
        address
      }
      metadata {
          displayName
          coverPicture {
            optimized {
              uri
            }
          }
          bio
          picture {
            ... on ImageSet {
              optimized {
                uri
              }
            }
          }
        }
        stats {
          followers
        }
      }
    }
`
