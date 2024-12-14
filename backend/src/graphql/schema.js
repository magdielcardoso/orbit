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
    permissions: [Permission!]
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

  type Activity {
    id: ID!
    type: String!
    description: String!
    user: String!
    timestamp: String!
  }

  type Query {
    me: User
    users: [User!]!
    roles: [Role!]!
    systemStatus: SystemStatus!
    recentActivities: [Activity!]!
    adminStats: AdminStats!
  }

  type AdminStats {
    totalUsers: Int!
    totalRoles: Int!
    roles: [Role!]!
  }

  type Mutation {
    # Auth
    register(email: String!, password: String!, name: String!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
    registerSuperAdmin(
      name: String!
      email: String!
      password: String!
      systemConfig: SystemConfigInput!
    ): SuperAdminRegistrationResponse!
    
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

  input SystemConfigInput {
    systemName: String!
    timezone: String!
  }

  type SuperAdminRegistrationResponse {
    token: String!
    user: User!
    systemConfig: SystemConfig!
  }

  type SystemConfig {
    id: ID!
    systemName: String!
    timezone: String!
    status: SystemStatus!
    setupCompletedAt: String
    createdAt: String!
    updatedAt: String!
  }
` 