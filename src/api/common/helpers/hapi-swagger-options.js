const hapiSwaggerOptions = {
  info: {
    title: 'FCP SFD Data API',
    version: '0.0.1',
    description: 'API for FCP Single Front Door Data service',
    contact: {
      name: 'SFD Devs',
      url: 'https://github.com/orgs/DEFRA/teams/fcp-sfd-devs'
    }
  },
  basePath: '/api/v1',
  cors: false,
  documentationPath: '/documentation',
  grouping: 'tags',
  jsonPath: '/documentation.json',
  OAS: 'v3.0',
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'local server'
    }
  ],
  tags: [
    {
      name: 'health',
      description: 'Health check endpoint'
    },
    {
      name: 'comms',
      description: 'Operations supporting the SFD communications service'
    },
    {
      name: 'object',
      description: 'Operations supporting the SFD object processing service'
    }
  ]
}

export { hapiSwaggerOptions }
