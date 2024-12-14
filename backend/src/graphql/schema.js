export const typeDefs = `#graphql
  type User {
    id: ID!
    email: String!
    name: String!
    role: Role
    active: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  type Role {
    id: ID!
    name: String!
    description: String
    permissions: [Permission!]!
    createdAt: String!
    updatedAt: String!
  }

  type Permission {
    id: ID!
    name: String!
    description: String
    createdAt: String!
    updatedAt: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type SystemStatus {
    configured: Boolean!
    version: String!
    status: String!
  }

  type Query {
    me: User
    users: [User!]!
    roles: [Role!]!
    permissions: [Permission!]!
    systemStatus: SystemStatus!
  }

  type Mutation {
    # Auth
    register(email: String!, password: String!, name: String!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
    
    # Users
    createUser(email: String!, password: String!, name: String!, roleId: String): User!
    updateUser(id: ID!, email: String, name: String, roleId: String, active: Boolean): User!
    deleteUser(id: ID!): Boolean!
    
    # Roles
    createRole(name: String!, description: String): Role!
    updateRole(id: ID!, name: String, description: String): Role!
    deleteRole(id: ID!): Boolean!
    
    # Role Permissions
    addPermissionToRole(roleId: ID!, permissionId: ID!): Role!
    removePermissionFromRole(roleId: ID!, permissionId: ID!): Role!
  }
` 