function getEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Required environment variable ${key} is not configured`);
  }
  return value;
}

export const env = {
  NODE_ENV: getEnv('NODE_ENV'),
  PORT: getEnv('PORT'),
  MONGO_URI: getEnv('MONGO_URI'),
  REDIS_URL: getEnv('REDIS_URL'),
  JWT_ACCESS_SECRET: getEnv('JWT_ACCESS_SECRET'),
  JWT_REFRESH_SECRET: getEnv('JWT_REFRESH_SECRET'),
  JWT_ACCESS_EXPIRES_IN: getEnv('JWT_ACCESS_EXPIRES_IN'),
  JWT_REFRESH_EXPIRES_IN: getEnv('JWT_REFRESH_EXPIRES_IN'),
  EMAIL_USER: getEnv('EMAIL_USER'),
  EMAIL_PASS: getEnv('EMAIL_PASS'),
  GOOGLE_CLIENT_ID: getEnv('GOOGLE_CLIENT_ID'),
//   GOOGLE_CLIENT_SECRET: getEnv('GOOGLE_CLIENT_SECRET'),
  COOKIE_NAME_REFRESH: getEnv('COOKIE_NAME_REFRESH'),
  COOKIE_NAME_ACCESS: getEnv('COOKIE_NAME_ACCESS'),
  FRONTEND_URL: getEnv('FRONTEND_URL'),
  OTP_TTL_SECONDS: getEnv('OTP_TTL_SECONDS'),
  AWS_S3_BUCKET_NAME : getEnv('AWS_S3_BUCKET_NAME'),
  AWS_REGION: getEnv('AWS_REGION'),
  AWS_ACCESS_KEY_ID: getEnv('AWS_ACCESS_KEY_ID'),
  AWS_SECRET_ACCESS_KEY: getEnv('AWS_SECRET_ACCESS_KEY'),
  ENCRYPTION_KEY: getEnv('ENCRYPTION_KEY'),
};