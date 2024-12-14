export const typeDefs = `#graphql
  scalar JSON

  type User {
    id: ID!
    email: String!
    name: String!
    role: Role
    active: Boolean!
    createdAt: String!
    updatedAt: String!
    parentUser: User
    parentUserId: String
    agents: [User!]
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

  enum ActivityType {
    USER_ACTION
    SYSTEM_EVENT
    ERROR
    AUTH
    API_CALL
  }

  enum ActivityLevel {
    INFO
    WARNING
    ERROR
    DEBUG
  }

  type Activity {
    id: ID!
    type: ActivityType!
    level: ActivityLevel!
    source: String!
    action: String!
    description: String!
    user: User!
    metadata: JSON
    createdAt: String!
  }

  type Query {
    me: User
    users: [User!]!
    roles: [Role!]!
    permissions: [Permission!]!
    systemStatus: SystemStatus!
    recentActivities: [Activity!]!
    adminStats: AdminStats!
    activities(
      limit: Int
      offset: Int
      type: ActivityType
      level: ActivityLevel
      source: String
    ): [Activity!]!
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
    createUser(
      email: String!, 
      password: String!, 
      name: String!, 
      roleId: String!, 
      parentUserId: String
    ): User!
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