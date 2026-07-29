export {};

// Define allowed application roles matching our Prisma schema
export type UserRole = "INSTRUCTOR" | "STUDENT";

declare global {
  // 1. Extend Clerk's Session Claims type to include custom metadata properties
  interface CustomJwtSessionClaims {
    metadata: {
      role?: UserRole;
    };
  }

  // 2. Extend Clerk's User Public Metadata interface
  interface UserPublicMetadata {
    role?: UserRole;
  }
}
