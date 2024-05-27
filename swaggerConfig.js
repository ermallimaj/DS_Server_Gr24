const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Your Project API',
      version: '1.0.0',
      description: 'API Documentation for Your Project',
    },
    servers: [
      {
        url: 'http://localhost:3000/api/v1',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: '60d0fe4f5311236168a109ca',
            },
            name: {
              type: 'string',
              example: 'John Doe',
            },
            email: {
              type: 'string',
              example: 'john@example.com',
            },
            username: {
              type: 'string',
              example: 'johndoe',
            },
            password: {
              type: 'string',
              example: 'password123',
            },
          },
        },
        Notification: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: '60d0fe4f5311236168a109ca',
            },
            user: {
              type: 'string',
              example: '60d0fe4f5311236168a109cb',
            },
            type: {
              type: 'string',
              enum: ['like', 'comment', 'follow'],
              example: 'like',
            },
            postId: {
              type: 'string',
              example: '60d0fe4f5311236168a109cc',
            },
            userProfileImage: {
              type: 'string',
              example: 'profile.jpg',
            },
            postImage: {
              type: 'string',
              example: 'post.jpg',
            },
            username: {
              type: 'string',
              example: 'johndoe',
            },
            commentText: {
              type: 'string',
              example: 'Nice post!',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            seen: {
              type: 'boolean',
              example: false,
            },
            sentById: {
              type: 'string',
              example: '60d0fe4f5311236168a109cd',
            },
          },
        },
        Room: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                example: '60d0fe4f5311236168a109ca',
              },
              participants: {
                type: 'array',
                items: {
                  type: 'string',
                },
                example: ['60d0fe4f5311236168a109cb', '60d0fe4f5311236168a109cc'],
              },
              messages: {
                type: 'array',
                items: {
                  type: 'string',
                },
                example: ['60d0fe4f5311236168a109cd'],
              },
            },
          },
          Message: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                example: '60d0fe4f5311236168a109cd',
              },
              sender: {
                type: 'string',
                example: '60d0fe4f5311236168a109cb',
              },
              receiver: {
                type: 'string',
                example: '60d0fe4f5311236168a109cc',
              },
              content: {
                type: 'string',
                example: 'Hello!',
              },
              createdAt: {
                type: 'string',
                format: 'date-time',
              },
              seen: {
                type: 'boolean',
                example: false,
              },
              room: {
                type: 'string',
                example: '60d0fe4f5311236168a109ca',
              },
            },
          },
          Post: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                example: '60d0fe4f5311236168a109ca',
              },
              user: {
                type: 'string',
                example: '60d0fe4f5311236168a109cb',
              },
              image: {
                type: 'string',
                example: 'image.jpg',
              },
              caption: {
                type: 'string',
                example: 'This is a caption',
              },
              likes: {
                type: 'array',
                items: {
                  type: 'string',
                },
              },
              comments: {
                type: 'array',
                items: {
                  type: 'string',
                },
              },
              createdAt: {
                type: 'string',
                format: 'date-time',
              },
            },
          },
          Comment: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                example: '60d0fe4f5311236168a109cc',
              },
              comment: {
                type: 'string',
                example: 'This is a comment',
              },
              onPost: {
                type: 'string',
                example: '60d0fe4f5311236168a109ca',
              },
              postedBy: {
                type: 'string',
                example: '60d0fe4f5311236168a109cb',
              },
              createdAt: {
                type: 'string',
                format: 'date-time',
              },
            },
          },
        SavedPost: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: '60d0fe4f5311236168a109ca',
            },
            user: {
              type: 'string',
              example: '60d0fe4f5311236168a109cb',
            },
            post: {
              type: 'string',
              example: '60d0fe4f5311236168a109cc',
            },
            savedAt: {
              type: 'string',
              format: 'date-time',
              example: '2021-06-24T14:48:00.000Z',
            },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: '60d0fe4f5311236168a109ca',
            },
            name: {
              type: 'string',
              example: 'John Doe',
            },
            email: {
              type: 'string',
              example: 'john@example.com',
            },
            username: {
              type: 'string',
              example: 'johndoe',
            },
            password: {
              type: 'string',
              example: 'password123',
            },
          },
        },
        // Add other schemas...
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./Controllers/*.js', './Routes/*.js', './Models/*.js'],
};

const specs = swaggerJsdoc(options);

module.exports = specs;
