export default () => ({
	port: 5000,
	db: {
		type: 'db-type',
		host: 'db-host',
		port: 5432,
		database: 'db-name',
		username: 'db-user',
		password: 'db-password',
		synchronize: false,
		entities: ['dist/entity//*.{ts,js}'],
		ormEntities: ['src/entity//*.ts'],
		migrations: ['src/migration//*.ts'],
		subscribers: ['src/subscriber//*.ts'],
		cli: {
			entitiesDir: 'src/entity',
			migrationsDir: 'src/migration',
			subscribersDir: 'src/subscriber',
		},
	},
	swagger: {
		title: 'Boilerplate',
		description: 'NestJS Boilerplate',
	},
	aws: {
		accessKeyId: 'your-aws-accessKeyId',
		secretAccessKey: 'your-aws-secretAccessKey',
		cognito: {
			region: 'your-aws-region',
			userPoolId: 'your-aws-user-pool-id',
		},
		s3: {
			bucket: 'bucket',
			getUrlTtl: 'get-url-ttl',
			postUrlTtl: 'post-url-ttl',
			region: 'region',
		},
	},
});
