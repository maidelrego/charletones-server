export const EnvConfig = () => ({
  environment: process.env.NODE_ENV || 'dev',
  mongodb: process.env.MONGO_URI,
  port: process.env.PORT || 3000,
});
