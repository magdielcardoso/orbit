import { Kind } from 'graphql';
import OrganizationService from '../../services/organization.service.js';

export const resolvers = {
  JSON: {
    __parseValue(value) {
      return JSON.parse(value);
    },
    __serialize(value) {
      return JSON.stringify(value);
    },
    __parseLiteral(ast) {
      switch (ast.kind) {
        case Kind.STRING:
          return JSON.parse(ast.value);
        case Kind.OBJECT:
          return ast.fields.reduce((acc, field) => {
            acc[field.name.value] = this.__parseLiteral(field.value);
            return acc;
          }, {});
        default:
          return null;
      }
    },
  },

  Query: {
    organizations: async (_, __, { user }) => {
      return await OrganizationService.getOrganizations(user);
    },

    organization: async (_, { id }, { user }) => {
      return await OrganizationService.getOrganization(user, id);
    },

    validateOrganizationSlug: async (_, { slug }) => {
      return await OrganizationService.validateOrganizationSlug(slug);
    },
  },

  Mutation: {
    createOrganization: async (_, { input }, { user }) => {
      return await OrganizationService.createOrganization(user, input);
    },
  },
};
