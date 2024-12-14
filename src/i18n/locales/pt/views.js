export default {
  home: {
    title: 'Início',
    welcome: 'Bem-vindo ao OrbitChat'
  },
  chats: {
    title: 'Conversas',
    noChats: 'Nenhuma conversa ainda',
    newChat: 'Nova conversa',
    searchPlaceholder: 'Buscar conversas...',
    messagePlaceholder: 'Digite sua mensagem...',
    typeMessage: 'Digite sua mensagem...',
    send: 'Enviar',
    status: {
      open: 'Em aberto',
      closed: 'Fechado',
      resolved: 'Resolvido'
    },
    tabs: {
      mine: 'Minhas',
      unassigned: 'Não atribuídas',
      all: 'Todas'
    },
    emptyState: {
      title: 'Oh não! Parece que não há mensagens de clientes na sua caixa de entrada.',
      shortcuts: {
        command: 'para abrir o menu de comando',
        keyboard: 'para ver os atalhos de teclado'
      }
    },
    sidebar: {
      filters: {
        title: 'Filtros',
        all: 'Todas as conversas',
        active: 'Conversas ativas',
        archived: 'Conversas arquivadas'
      },
      labels: {
        title: 'Etiquetas',
        important: 'Importante',
        unread: 'Não lidas',
        flagged: 'Sinalizadas'
      },
      teams: {
        title: 'Equipes',
        myTeam: 'Minha equipe',
        assignedToMe: 'Atribuídas a mim'
      }
    }
  },
  contacts: {
    title: 'Contatos',
    noContacts: 'Nenhum contato ainda',
    addContact: 'Adicionar contato'
  },
  favorites: {
    title: 'Favoritos',
    noFavorites: 'Nenhum favorito ainda'
  },
  settings: {
    title: 'Configurações',
    language: 'Idioma',
    selectLanguage: 'Selecione o idioma',
    selectTheme: 'Selecione o tema',
    themes: {
      light: 'Tema Claro',
      dark: 'Tema Escuro'
    },
    languageHelp: 'O idioma selecionado será aplicado em toda a aplicação',
    theme: 'Tema',
    notifications: 'Notificações',
    privacy: 'Privacidade',
    sections: {
      preferences: {
        title: 'Preferências do Usuário',
        general: {
          title: 'Configurações Gerais',
          description: 'Configure as configurações básicas da sua conta'
        },
        profile: {
          title: 'Configurações de Perfil',
          description: 'Gerencie suas informações de perfil'
        }
      },
      notifications: {
        title: 'Notificações',
        preferences: {
          title: 'Preferências de Notificação',
          description: 'Configure como você recebe notificações'
        }
      },
      security: {
        title: 'Segurança',
        settings: {
          title: 'Configurações de Segurança',
          description: 'Gerencie a segurança da sua conta'
        },
        apiTokens: {
          title: 'Tokens de API',
          description: 'Gerencie seus tokens de acesso à API'
        }
      }
    }
  },
  auth: {
    login: {
      title: 'Entrar na sua conta',
      email: 'E-mail',
      password: 'Senha',
      rememberMe: 'Lembrar-me',
      loading: 'Carregando...',
      submit: 'Entrar',
      noAccount: 'Não tem uma conta? Cadastre-se',
      error: 'E-mail ou senha inválidos',
      hero: {
        title: 'Bem-vindo ao OrbitChat',
        feature1: {
          title: 'Comunicação Simplificada',
          description: 'Gerencie todas as suas conversas em um só lugar de forma eficiente e organizada.'
        },
        feature2: {
          title: 'Equipes Integradas',
          description: 'Colabore com sua equipe em tempo real e mantenha todos alinhados.'
        },
        feature3: {
          title: 'Análises Detalhadas',
          description: 'Acompanhe o desempenho e tome decisões baseadas em dados.'
        }
      }
    },
    register: {
      title: 'Criar sua conta',
      subtitle: 'Comece sua jornada conosco',
      name: 'Nome',
      namePlaceholder: 'Digite seu nome completo',
      email: 'E-mail',
      emailPlaceholder: 'Digite seu e-mail',
      password: 'Senha',
      passwordPlaceholder: 'Digite sua senha',
      submit: 'Criar conta',
      loading: 'Criando...',
      error: 'Erro ao criar conta. Tente novamente.',
      hasAccount: 'Já tem uma conta? Faça login',
      hero: {
        title: 'Bem-vindo ao OrbitChat',
        feature1: {
          title: 'Comunicação em Tempo Real',
          description: 'Chat instantâneo com colegas e equipes'
        },
        feature2: {
          title: 'Segurança Avançada',
          description: 'Suas conversas protegidas com criptografia'
        },
        feature3: {
          title: 'Integração Completa',
          description: 'Conecte-se com suas ferramentas favoritas'
        }
      }
    }
  },
  admin: {
    users: {
      title: 'Usuários',
      description: 'Gerencie os usuários do sistema.',
      addUser: 'Adicionar Usuário',
      newUser: 'Novo Usuário',
      confirmDelete: 'Tem certeza que deseja excluir o usuário {name}?',
      table: {
        name: 'Nome',
        email: 'E-mail',
        role: 'Função',
        status: 'Status',
        actions: 'Ações'
      },
      status: {
        active: 'Ativo',
        inactive: 'Inativo'
      },
      form: {
        name: 'Nome',
        email: 'E-mail',
        password: 'Senha',
        role: 'Função',
        selectRole: 'Selecione uma função',
        parentUser: 'Usuário Responsável',
        selectParentUser: 'Selecione o usuário responsável',
        agentInfo: 'Um agente é um usuário que atua em nome de um usuário normal. Agentes podem atender chats e interagir com clientes em nome do usuário responsável. Cada agente deve estar vinculado a um usuário normal.',
        status: {
          title: 'Status',
          active: 'Ativo',
          inactive: 'Inativo',
          toggleActive: 'Clique para ativar/desativar o usuário'
        },
        organization: {
          title: 'Organização',
          select: 'Selecione uma organização',
          permissions: 'Permissões na organização',
          isAdmin: 'Administrador da organização',
          isOwner: 'Proprietário da organização',
          noOrganization: 'Sem organização'
        },
        organization: 'Organização',
        selectOrganization: 'Selecione uma organização',
        isAdmin: 'Administrador da organização',
        isOwner: 'Proprietário da organização'
      },
      noUsers: 'Nenhum usuário encontrado',
      noRole: 'Sem função atribuída',
      loading: 'Carregando usuários...',
      agentOf: 'Agente de',
      editUser: 'Editar Usuário',
      updateSuccess: 'Usuário atualizado com sucesso!',
      errors: {
        userNotFound: 'Usuário não encontrado',
        organizationRequired: 'Selecione uma organização',
        loadingFailed: 'Erro ao carregar usuário',
        updateFailed: 'Erro ao atualizar usuário',
        createError: 'Erro ao criar usuário',
        updateError: 'Erro ao atualizar usuário',
        deleteError: 'Erro ao excluir usuário'
      },
      createSuccess: 'Usuário criado com sucesso!',
      deleteSuccess: 'Usuário excluído com sucesso!'
    },
    roles: {
      title: 'Papéis e Permissões',
      description: 'Gerencie os papéis e suas permissões no sistema.',
      addRole: 'Adicionar Papel',
      newRole: 'Novo Papel',
      editRole: 'Editar Papel',
      name: 'Nome do Papel',
      description: 'Descrição',
      permissions: 'Permissões',
      confirmDelete: 'Tem certeza que deseja excluir o papel {name}?',
      actions: {
        edit: 'Editar',
        delete: 'Excluir'
      }
    },
    organizations: {
      title: 'Organizações',
      description: 'Gerencie as organizações do sistema.',
      addOrganization: 'Adicionar Organização',
      newOrganization: 'Nova Organização',
      editOrganization: 'Editar Organização',
      createSuccess: 'Organização criada com sucesso!',
      updateSuccess: 'Organização atualizada com sucesso!',
      deleteSuccess: 'Organização excluída com sucesso!',
      confirmDelete: 'Tem certeza que deseja excluir a organização {name}?',
      table: {
        name: 'Nome',
        slug: 'Slug',
        plan: 'Plano',
        users: 'Usuários',
        status: 'Status',
        actions: 'Ações'
      },
      status: {
        active: 'Ativa',
        suspended: 'Suspensa',
        pending: 'Pendente',
        overdue: 'Em atraso',
        cancelled: 'Cancelada'
      },
      form: {
        name: 'Nome',
        namePlaceholder: 'Nome da organização',
        slug: 'Slug',
        slugPlaceholder: 'identificador-unico',
        domain: 'Domínio',
        domainPlaceholder: 'empresa.com.br',
        plan: 'Plano',
        selectPlan: 'Selecione um plano',
        maxUsers: 'Limite de usuários',
        maxTeams: 'Limite de times',
        maxInboxes: 'Limite de caixas de entrada',
        timezone: 'Fuso horário',
        locale: 'Idioma padrão'
      },
      plans: {
        free: 'Gratuito',
        starter: 'Iniciante',
        professional: 'Profissional',
        enterprise: 'Empresarial'
      }
    }
  }
} 