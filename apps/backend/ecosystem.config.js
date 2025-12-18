module.exports = {
	apps: [
		{
			name: "my-nest-app",
			script: "dist/main.js",
			instances: 2, // 或 'max' 多核
			autorestart: true,
			watch: false,
			env: {
				NODE_ENV: "development",
				DATABASE_URL:
					"postgresql://appuser:StrongPassword123!@localhost:5432/appdb?schema=public",
			},
			env_production: {
				NODE_ENV: "production",
			},
		},
	],
};
