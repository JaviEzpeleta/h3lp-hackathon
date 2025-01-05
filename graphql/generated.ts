import { gql } from "@apollo/client/core";

// Challenge Query
export const ChallengeDocument = gql`
  query Challenge($request: ChallengeRequest!) {
    challenge(request: $request) {
      id
      text
    }
  }
`;

// Authenticate Mutation
export const AuthenticateDocument = gql`
  mutation Authenticate($request: SignedAuthChallenge!) {
    authenticate(request: $request) {
      accessToken
      refreshToken
    }
  }
`;

export interface ChallengeRequest {
  for: string; // Profile ID
  signedBy: string; // Wallet address
}

export interface SignedAuthChallenge {
  id: string; // Challenge ID
  signature: string; // Signed text
}
