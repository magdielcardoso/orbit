export const typeDefs = `#graphql
  scalar JSON
  scalar DateTime

  type User {
    id: ID!
    email: String!
    name: String!
    role: Role
    active: Boolean!
    createdAt: DateTime!
    updatedAt: DateTime!
    parentUser: User
    parentUserId: String
    agents: [User!]
    avatar: String
    status: String
    lastActivityAt: DateTime
    organizations: [OrganizationUser!]
    currentOrgId: String
    preferences: JSON
    lastSeenAt: DateTime
    assignedConversations: [Conversation!]
    teams: [TeamMember!]
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
    organization(id: ID!): Organization
    myOrganizations: [Organization!]!
    inboxes(organizationId: ID!): [Inbox!]!
    inbox(id: ID!): Inbox
    conversations(
      organizationId: ID!, 
      status: ConversationStatus,
      priority: Priority,
      assigneeId: ID,
      inboxId: ID,
      limit: Int,
      offset: Int
    ): [Conversation!]!
    conversation(id: ID!): Conversation
    contacts(
      organizationId: ID!,
      search: String,
      tags: [String!],
      limit: Int,
      offset: Int
    ): [Contact!]!
    contact(id: ID!): Contact
    teams(organizationId: ID!): [Team!]!
    team(id: ID!): Team
    automations(organizationId: ID!): [Automation!]!
    automation(id: ID!): Automation
    organizations: [Organization!]!
    validateOrganizationSlug(slug: String!): OrganizationSlugValidation!
  }

  type AdminStats {
    totalUsers: Int!
    totalRoles: Int!
    roles: [Role!]!
  }

  type Mutation {
    # Auth
    register(email: String!, password: String!, name: String!, organizationHashId: String): AuthPayload!
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
    updateUser(
      id: ID!, 
      input: UserInput!
    ): User!
    deleteUser(id: ID!): Boolean!
    
    # Roles
    createRole(name: String!, description: String): Role!
    updateRole(id: ID!, name: String, description: String): Role!
    deleteRole(id: ID!): Boolean!
    
    # Role Permissions
    addPermissionToRole(roleId: ID!, permissionId: ID!): Role!
    removePermissionFromRole(roleId: ID!, permissionId: ID!): Role!
    
    # Mutations de organização
    createOrganization(input: OrganizationInput!): Organization!
    updateOrganization(id: ID!, input: OrganizationInput!): Organization!
    deleteOrganization(id: ID!): Boolean!
    
    # Mutations de inbox
    createInbox(input: InboxInput!): Inbox!
    updateInbox(id: ID!, input: InboxInput!): Inbox!
    deleteInbox(id: ID!): Boolean!
    
    # Mutations de conversa
    createConversation(input: ConversationInput!): Conversation!
    updateConversation(id: ID!, input: ConversationInput!): Conversation!
    assignConversation(id: ID!, assigneeId: ID): Conversation!
    changeConversationStatus(id: ID!, status: ConversationStatus!): Conversation!
    
    # Mutations de mensagem
    sendMessage(input: MessageInput!): Message!
    
    # Mutations de contato
    createContact(input: ContactInput!): Contact!
    updateContact(id: ID!, input: ContactInput!): Contact!
    deleteContact(id: ID!): Boolean!
    
    # Mutations de time
    createTeam(input: TeamInput!): Team!
    updateTeam(id: ID!, input: TeamInput!): Team!
    deleteTeam(id: ID!): Boolean!
    addTeamMember(teamId: ID!, userId: ID!, isLeader: Boolean): TeamMember!
    removeTeamMember(teamId: ID!, userId: ID!): Boolean!
    
    # Mutations de automação
    createAutomation(input: AutomationInput!): Automation!
    updateAutomation(id: ID!, input: AutomationInput!): Automation!
    deleteAutomation(id: ID!): Boolean!
    toggleAutomation(id: ID!): Automation!
    
    # Mutations de etiquetas
    createLabel(input: LabelInput!): Label!
    updateLabel(id: ID!, input: LabelInput!): Label!
    deleteLabel(id: ID!): Boolean!
    
    # Mutations de relação inbox-team
    addInboxToTeam(input: InboxTeamInput!): InboxTeam!
    removeInboxFromTeam(inboxId: ID!, teamId: ID!): Boolean!
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

  # Novos tipos para multi-tenancy
  type Organization {
    id: ID!
    name: String!
    slug: String!
    domain: String
    plan: SubscriptionPlan!
    paymentStatus: PaymentStatus!
    maxUsers: Int!
    maxTeams: Int!
    maxInboxes: Int!
    timezone: String!
    locale: String!
    features: JSON
    billingEmail: String
    billingName: String
    billingAddress: JSON
    taxId: String
    users: [OrganizationUser!]!
    teams: [Team!]!
    inboxes: [Inbox!]!
    conversations: [Conversation!]!
    contacts: [Contact!]!
    automations: [Automation!]!
    createdAt: DateTime!
    updatedAt: DateTime!
    deletedAt: DateTime
  }

  type OrganizationUser {
    id: ID!
    organization: Organization!
    user: User!
    isAdmin: Boolean!
    isOwner: Boolean!
    status: String!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  # Tipos para chat omnichannel
  type Inbox {
    id: ID!
    name: String!
    description: String
    isEnabled: Boolean!
    channelType: ChannelSource!
    channelConfig: JSON
    organization: Organization!
    conversations: [Conversation!]!
    teams: [InboxTeam!]!
    workingHours: JSON
    autoAssignment: Boolean!
    assignmentRules: JSON
    welcomeMessage: String
    awayMessage: String
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Team {
    id: ID!
    name: String!
    description: String
    isEnabled: Boolean!
    organization: Organization!
    members: [TeamMember!]!
    inboxes: [InboxTeam!]!
    color: String!
    icon: String
    settings: JSON
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type TeamMember {
    id: ID!
    team: Team!
    user: User!
    isLeader: Boolean!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Contact {
    id: ID!
    organization: Organization!
    name: String!
    email: String
    phone: String
    avatar: String
    customFields: JSON
    tags: [String!]!
    notes: String
    lastContactedAt: DateTime
    conversations: [Conversation!]!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Conversation {
    id: ID!
    status: ConversationStatus!
    priority: Priority!
    subject: String
    inbox: Inbox!
    messages: [Message!]!
    assignee: User
    labels: [ConversationLabel!]!
    channelData: JSON
    customFields: JSON
    organization: Organization!
    contact: Contact
    firstResponseAt: DateTime
    resolvedAt: DateTime
    reopenedAt: DateTime
    closedAt: DateTime
    slaStatus: String
    rating: Int
    ratingComment: String
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Message {
    id: ID!
    content: String!
    conversation: Conversation!
    user: User!
    type: String!
    metadata: JSON
    private: Boolean!
    attachments: JSON
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Automation {
    id: ID!
    name: String!
    description: String
    isActive: Boolean!
    organization: Organization!
    trigger: JSON!
    conditions: JSON!
    actions: JSON!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  # Enums
  enum SubscriptionPlan {
    FREE
    STARTER
    PROFESSIONAL
    ENTERPRISE
  }

  enum PaymentStatus {
    ACTIVE
    PENDING
    OVERDUE
    CANCELLED
  }

  enum ConversationStatus {
    OPEN
    PENDING
    RESOLVED
    CLOSED
  }

  enum Priority {
    LOW
    MEDIUM
    HIGH
    URGENT
  }

  enum ChannelSource {
    WEBCHAT
    WHATSAPP
    TELEGRAM
    EMAIL
    API
  }

  # Inputs
  input OrganizationInput {
    name: String!
    slug: String!
    plan: SubscriptionPlan!
    domain: String
    timezone: String
    locale: String
    features: JSON
  }

  input InboxInput {
    name: String!
    description: String
    organizationId: ID!
    channelType: ChannelSource!
    channelConfig: JSON
    workingHours: JSON
    autoAssignment: Boolean
    assignmentRules: JSON
    welcomeMessage: String
    awayMessage: String
  }

  input ConversationInput {
    subject: String
    inboxId: ID!
    organizationId: ID!
    priority: Priority
    contactId: ID
    customFields: JSON
  }

  input MessageInput {
    conversationId: ID!
    content: String!
    type: String
    private: Boolean
    attachments: JSON
  }

  input ContactInput {
    organizationId: ID!
    name: String!
    email: String
    phone: String
    avatar: String
    customFields: JSON
    tags: [String!]
    notes: String
  }

  input TeamInput {
    name: String!
    description: String
    organizationId: ID!
    color: String
    icon: String
    settings: JSON
  }

  input AutomationInput {
    name: String!
    description: String
    organizationId: ID!
    trigger: JSON!
    conditions: JSON!
    actions: JSON!
  }

  # Tipo para relação entre Time e Inbox
  type InboxTeam {
    id: ID!
    inbox: Inbox!
    team: Team!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  # Tipo para etiquetas de conversa
  type ConversationLabel {
    id: ID!
    conversation: Conversation!
    label: Label!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  # Tipo para etiquetas
  type Label {
    id: ID!
    name: String!
    color: String!
    description: String
    conversations: [ConversationLabel!]!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  # Adicionar também os inputs relacionados
  input LabelInput {
    name: String!
    color: String
    description: String
  }

  input InboxTeamInput {
    inboxId: ID!
    teamId: ID!
  }

  # Adicione o tipo UserInput
  input UserInput {
    name: String
    email: String
    roleId: String
    active: Boolean
    parentUserId: String
    currentOrgId: String
  }

  input RegisterInput {
    name: String!
    email: String!
    password: String!
    organization: OrganizationRegisterInput!
  }

  input OrganizationRegisterInput {
    name: String!
    slug: String!
    domain: String
    timezone: String!
    locale: String!
  }

  type OrganizationSlugValidation {
    available: Boolean!
    organization: OrganizationPreview
  }

  type OrganizationPreview {
    name: String!
    slug: String!
    domain: String
    hash_id: String
  }
` 