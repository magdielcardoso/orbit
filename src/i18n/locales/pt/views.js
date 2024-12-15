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
    description: 'Gerencie seus contatos e mantenha seu relacionamento com clientes.',
    noContacts: 'Nenhum contato encontrado',
    addContact: 'Adicionar Contato',
    newContact: 'Novo Contato',
    editContact: 'Editar Contato',
    management: 'Gerenciamento',
    allContacts: 'Todos os Contatos',
    favorites: 'Favoritos',
    recent: 'Recentes',
    segments: {
      title: 'Segmentos',
      customers: 'Clientes',
      leads: 'Leads',
      archived: 'Arquivados'
    },
    table: {
      name: 'Nome',
      email: 'E-mail',
      phone: 'Telefone',
      lastContact: 'Último Contato',
      tags: 'Tags'
    },
    form: {
      name: 'Nome',
      email: 'E-mail',
      phone: 'Telefone',
      tags: 'Tags',
      notes: 'Observações',
      namePlaceholder: 'Digite o nome do contato',
      emailPlaceholder: 'Digite o e-mail do contato',
      phonePlaceholder: 'Digite o telefone do contato',
      tagsPlaceholder: 'Separe as tags por vírgula',
      notesPlaceholder: 'Adicione observações sobre o contato'
    },
    confirmDelete: 'Tem certeza que deseja excluir o contato {name}?',
    createSuccess: 'Contato criado com sucesso!',
    updateSuccess: 'Contato atualizado com sucesso!',
    deleteSuccess: 'Contato excluído com sucesso!',
    errors: {
      createError: 'Erro ao criar contato',
      updateError: 'Erro ao atualizar contato',
      deleteError: 'Erro ao excluir contato',
      notFound: 'Contato não encontrado',
      nameRequired: 'O nome do contato é obrigatório'
    }
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
          title: 'Preferências de Notifica��ões',
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
      },
      inbox: {
        title: 'Caixas de Entrada',
        inboxes: 'Caixas de Entrada',
        addInbox: 'Adicionar Caixa de Entrada',
        noInboxes: 'Nenhuma caixa de entrada encontrada',
        addInboxHelp: 'Adicione sua primeira caixa de entrada para começar a gerenciar suas comunicações'
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
      orContinueWith: 'ou continue com',
      error: 'E-mail ou senha inválidos',
      termsText: 'Ao continuar, você concorda com nossos',
      privacyPolicy: 'Política de Privacidade',
      termsOfUse: 'Termos de Uso',
      and: 'e',
      hero: {
        title: 'Bem-vindo ao OrbitChat',
        feature1: {
          title: 'Comunica��ão Simplificada',
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
          permissions: 'Permissões da organização',
          isAdmin: 'Administrador da organização',
          isOwner: 'Proprietário da organização',
          noOrganization: 'Sem organização'
        }
      },
      noUsers: 'Nenhum usuário encontrado',
      noRole: 'Sem função atribuída',
      loading: 'Carregando usuários...',
      editUser: 'Editar Usuário',
      updateSuccess: 'Usuário atualizado com sucesso!',
      errors: {
        userNotFound: 'Usuário não encontrado',
        organizationRequired: 'Selecione uma organização',
        loadingFailed: 'Erro ao carregar usuário',
        updateFailed: 'Erro ao atualizar usuário'
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
        locale: 'Idioma padrão',
        organization: {
          name: 'Nome da Organização',
          namePlaceholder: 'Digite o nome da sua organização',
          slug: 'Identificador único',
          slugPlaceholder: 'identificador-unico',
          domain: 'Domínio',
          domainPlaceholder: 'exemplo.com.br',
          slugInUse: 'Este identificador já está em uso. Por favor, escolha outro.'
        }
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