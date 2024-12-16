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
    description: 'Gerencie seus contatos e mantenha suas informações organizadas',
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
      notesPlaceholder: 'Adicione observações sobre o contato',
      editDescription: 'Edite as informações do contato abaixo.'
    },
    confirmDelete: 'Excluir {name}?',
    confirmDeleteDescription: 'Esta ação não pode ser desfeita.',
    createSuccess: 'Contato criado com sucesso!',
    updateSuccess: 'Contato atualizado com sucesso!',
    deleteSuccess: 'Contato excluído com sucesso!',
    errors: {
      createError: 'Erro ao criar contato',
      updateError: 'Erro ao atualizar contato',
      deleteError: 'Erro ao excluir contato',
      notFound: 'Contato não encontrado',
      nameRequired: 'O nome do contato é obrigatório',
      duplicateContact: 'Já existe um contato com este telefone ou email',
      organizationRequired: 'Selecione uma organização primeiro'
    },
    details: {
      startChat: 'Iniciar Conversa',
      funnel: {
        title: 'Status do Funil',
        change: 'Mudar',
        stages: {
          lead: 'Lead',
          contact: 'Primeiro Contato',
          negotiation: 'Negociação',
          proposal: 'Proposta',
          closed: 'Fechado'
        }
      },
      contactInfo: 'Informações de Contato',
      notes: {
        title: 'Notas',
        empty: 'Nenhuma nota adicionada'
      },
      history: {
        title: 'Histórico',
        lastContact: 'Último contato',
        created: 'Criado em',
        updated: 'Atualizado em'
      },
      goals: {
        title: 'Objetivos',
        salesTarget: 'Meta de vendas',
        proposals: 'Propostas enviadas'
      },
      actions: {
        edit: 'Editar',
        delete: 'Excluir',
        startChat: 'Iniciar Conversa',
        filter: 'Filtrar',
        sort: 'Ordenar',
        newContact: 'Novo Contato'
      }
    }
  },
  favorites: {
    title: 'Favoritos',
    noFavorites: 'Nenhum favorito ainda'
  },
  settings: {
    title: 'Configurações',
    profile: {
      photo: 'Foto de Perfil',
      changePhoto: 'Alterar Foto',
      displayName: 'Nome de Exibição',
      displayNamePlaceholder: 'Como você quer ser chamado?',
      displayNameHelp: 'Este nome será exibido nas suas conversas e mensagens',
      email: 'E-mail',
      emailPlaceholder: 'Seu e-mail principal',
      emailHelp: 'Usado para notificações e recuperação de conta',
      messageSignature: 'Assinatura de Mensagem',
      messageSignatureDescription: 'Crie uma assinatura personalizada para suas mensagens. Ela será adicionada automaticamente ao final de cada mensagem que você enviar.',
      messageSignaturePlaceholder: 'Digite sua assinatura aqui...',
      messageSignatureHelp: 'Você pode incluir uma imagem embutida, que é suportada em chat ao vivo, e-mail e caixas de entrada da API.'
    },
    language: 'Idioma',
    languageHelp: 'O idioma selecionado será aplicado em toda a aplicação',
    selectLanguage: 'Selecione o idioma',
    saveSuccess: 'Configurações salvas com sucesso!',
    sections: {
      user: {
        title: 'Usuário',
        profile: 'Perfil',
        general: 'Geral',
        notifications: 'Notificações'
      },
      security: {
        title: 'Segurança',
        settings: 'Configurações de Segurança',
        apiTokens: 'Tokens de API'
      },
      communication: {
        title: 'Comunicação',
        signature: 'Assinatura de Mensagem',
        email: 'Configurações de E-mail'
      },
      preferences: {
        profile: {
          title: 'Configurações de Perfil'
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
      orContinueWith: 'ou continue com',
      error: 'E-mail ou senha inválidos',
      termsText: 'Ao continuar, você concorda com nossos',
      privacyPolicy: 'Política de Privacidade',
      termsOfUse: 'Termos de Uso',
      and: 'e',
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
      steps: {
        account: 'Conta',
        organization: 'Organização',
        confirmation: 'Confirmação'
      },
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
      confirmation: {
        userData: 'Dados do Usuário',
        organizationData: 'Dados da Organização',
        preferences: 'Preferências'
      },
      organization: {
        name: 'Nome da Organização',
        namePlaceholder: 'Digite o nome da sua organização',
        slug: 'Identificador único',
        slugPlaceholder: 'identificador-unico',
        domain: 'Domínio',
        domainPlaceholder: 'exemplo.com.br'
      },
      preferences: {
        timezone: 'Fuso horário',
        language: 'Idioma'
      },
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
  },
  common: {
    error: 'Erro',
    success: 'Sucesso',
    confirm: 'Confirmar',
    cancel: 'Cancelar',
    save: 'Salvar',
    loading: 'Carregando...',
    actions: 'Ações'
  },
  kanban: {
    title: 'Kanban',
    description: 'Gerencie suas tarefas e projetos de forma visual',
    columns: {
      backlog: 'Backlog',
      todo: 'A Fazer',
      inProgress: 'Em Progresso',
      review: 'Em Revisão',
      done: 'Concluído'
    },
    actions: {
      addCard: 'Adicionar Card',
      filter: 'Filtrar',
      sort: 'Ordenar',
      newTask: 'Nova Tarefa'
    }
  }
} 