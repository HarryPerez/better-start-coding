module.exports = {
  openapi: '3.0.1',
  info: {
    version: '1.3.0',
    title: 'My app',
  },
  servers: [
    {
      url: 'http://localhost:8080/',
      description: 'Local server',
    },
  ],
  components: {
  },
  paths: {
    '/health': {
      get: {
        tags: ['healtcheck'],
        description: 'Get uptime and health',
        operationId: 'health',
        parameters: [
        ],
        responses: {
          200: {
            description: 'uptime',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    uptime: {
                      type: 'number',
                      example: 1.0,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/sign_in': {
      post: {
        tags: ['login'],
        description: 'sign in',
        operationId: 'sign_in',
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/sign_in',
              },
            },
          },
          required: true,
        },
        responses: {
          200: {
            description: 'success',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    expirationTime: {
                      type: 'string',
                      example: '1h',
                    },
                    token: {
                      type: 'string',
                      example: 'fake_token',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/users': {
      post: {
        tags: ['user'],
        description: 'user creation',
        operationId: 'user_create',
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/user',
              },
            },
          },
          required: true,
        },
        responses: {
          201: {
            description: 'success',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    email: {
                      type: 'string',
                      example: 'hi@hi.com',
                    },
                  },
                },
              },
            },
          },
        },
      },
      get: {
        tags: ['user'],
        description: 'gets top 100 users of the database',
        operationId: 'users',
        parameters: [
          {
            name: 'users',
            in: 'query',
            schema: {
              type: 'object',
              properties: {
                filter: {
                  type: 'object',
                  properties: {
                    name: {
                      type: 'string',
                      description: 'user name',
                      example: 'gonza',
                    },
                    surname: {
                      type: 'string',
                      example: 'esc',
                      description: 'user surname',
                    },
                  },
                },
                sort: {
                  type: 'object',
                  properties: {
                    name: {
                      type: 'string',
                      description: 'user name',
                      example: 'gonza',
                    },
                    surname: {
                      type: 'string',
                      example: 'esc',
                      description: 'user surname',
                    },
                  },
                },
              },
            },
            required: false,
            description: 'query params for filtering or sorting',
          },
        ],
        responses: {
          200: {
            description: 'get users successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      name: {
                        type: 'string',
                        example: 'name',
                      },
                      surname: {
                        type: 'string',
                        example: 'surname',
                      },
                      email: {
                        type: 'email',
                        example: 'fake@fake.com',
                      },
                      section: {
                        type: 'string',
                        example: 'boss',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      delete: {
        tags: ['user'],
        description: 'delete the selected user',
        operationId: 'users',
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/forgot_password',
              },
            },
          },
          required: true,
        },
        responses: {
          204: {},
        },
      },
      put: {
        tags: ['user'],
        description: 'Update user',
        operationId: 'users',
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/user',
              },
            },
          },
          required: false,
        },
        responses: {
          200: {
            description: 'user updated',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: {
                      type: 'string',
                      example: 'name',
                    },
                    surname: {
                      type: 'string',
                      example: 'surname',
                    },
                    email: {
                      type: 'email',
                      example: 'fake@fake.com',
                    },
                    section: {
                      type: 'string',
                      example: 'boss',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/me': {
      get: {
        tags: ['user'],
        description: 'user detail',
        operationId: 'me',
        responses: {
          200: {
            description: 'success',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    user: {
                      type: 'object',
                      properties: {
                        name: {
                          type: 'string',
                          example: 'name',
                        },
                        surname: {
                          type: 'string',
                          example: 'surname',
                        },
                        email: {
                          type: 'email',
                          example: 'fake@fake.com',
                        },
                        password: {
                          type: 'string',
                          example: 'Asdf1234',
                        },
                        section: {
                          type: 'string',
                          example: 'boss',
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/users/forgot_password': {
      post: {
        tags: ['user'],
        description: 'user creation',
        operationId: 'user_create',
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/forgot_password',
              },
            },
          },
          required: true,
        },
        responses: {
          204: {
            description: 'success',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                  },
                },
              },
            },
          },
        },
      },
    },
    '/users/password': {
      post: {
        tags: ['user'],
        description: 'user creation',
        operationId: 'user_create',
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/password',
              },
            },
          },
          required: true,
        },
        responses: {
          201: {
            description: 'success',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    email: {
                      type: 'email',
                      example: 'fake@fake.com',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};
