export default class RedisService {
    static instance = null;

    constructor(fastify) {
        if (!fastify) {
            throw new Error('Fastify é obrigatório');
        }

        // Aguarda a inicialização do Redis
        if (!fastify.redis?.client || !fastify.redis?.subscriber) {
            throw new Error('Fastify Redis não está inicializado');
        }

        // Singleton check
        if (RedisService.instance) {
            return RedisService.instance;
        }

        this.publisher = fastify.redis.client;
        this.subscriber = fastify.redis.subscriber;
        
        // Adiciona handlers de erro
        this.publisher.on('error', (err) => {
            console.error('Erro no Redis Publisher:', err);
        });

        this.subscriber.on('error', (err) => {
            console.error('Erro no Redis Subscriber:', err);
        });

        RedisService.instance = this;
    }

    static getInstance(fastify) {
        if (!RedisService.instance) {
            RedisService.instance = new RedisService(fastify);
        }
        return RedisService.instance;
    }

    /**
     * Publica uma mensagem no canal
     * @param {string} channel - Nome do canal
     * @param {any} message - Mensagem a ser publicada
     */
    async publish(channel, message) {
        try {
            if (!this.publisher) {
                throw new Error('Publisher não inicializado');
            }

            await this.publisher.publish(channel, JSON.stringify({
                content: message,
                timestamp: Date.now()
            }));
        } catch (error) {
            console.error(`Erro ao publicar no canal ${channel}:`, error);
            throw error;
        }
    }

    /**
     * Inscreve em um canal
     * @param {string} channel - Nome do canal
     * @param {Function} callback - Função a ser executada quando receber mensagem
     */
    async subscribe(channel, callback) {
        try {
            if (!this.subscriber) {
                throw new Error('Subscriber não inicializado');
            }

            await this.subscriber.subscribe(channel, (message) => {
                callback(JSON.parse(message));
            });
        } catch (error) {
            console.error(`Erro ao se inscrever no canal ${channel}:`, error);
            throw error;
        }
    }

    /**
     * Cancela inscrição em um canal
     * @param {string} channel - Nome do canal
     */
    async unsubscribe(channel) {
        try {
            if (!this.subscriber) {
                throw new Error('Subscriber não inicializado');
            }

            await this.subscriber.unsubscribe(channel);
        } catch (error) {
            console.error(`Erro ao cancelar inscrição no canal ${channel}:`, error);
            throw error;
        }
    }
} 