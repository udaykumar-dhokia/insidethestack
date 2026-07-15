import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.enableCors({
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  const config = new DocumentBuilder()
    .setTitle('InsideTheStack API')
    .setVersion('1.0')
    .setContact('udthedeveloper', 'https://linkedin.com/in/udthedeveloper', '')
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .addServer(
      `http://localhost:${process.env.PORT ?? 3000}`,
      'Local development',
    )
    .addBearerAuth()
    .addTag('Auth', 'User registration and authentication endpoints')
    .addTag('General', 'Health checks and utility endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'list',
      filter: true,
      showRequestDuration: true,
      tryItOutEnabled: true,
    },
    customSiteTitle: 'InsideTheStack API Docs',
    customCss: `
      /* Dark theme overrides */
      body { background-color: #0a0a0a; }
      .swagger-ui { color: #e5e5e5; }
      .swagger-ui .topbar { background-color: #111111; border-bottom: 1px solid #222222; }
      .swagger-ui .topbar .download-url-wrapper .select-label span { color: #aaa; }
      .swagger-ui .info .title { color: #ffffff; }
      .swagger-ui .info p, .swagger-ui .info li { color: #aaaaaa; }
      .swagger-ui .scheme-container { background: #111111; box-shadow: none; border-bottom: 1px solid #222; }
      .swagger-ui .opblock-tag { color: #ffffff; border-bottom: 1px solid #222; }
      .swagger-ui .opblock .opblock-summary-operation-id,
      .swagger-ui .opblock .opblock-summary-path,
      .swagger-ui .opblock .opblock-summary-description { color: #e5e5e5; }
      .swagger-ui .opblock.opblock-post { background: rgba(73,204,144,0.05); border-color: #49cc90; }
      .swagger-ui .opblock.opblock-get  { background: rgba(97,175,254,0.05); border-color: #61affe; }
      .swagger-ui section.models { border: 1px solid #222; }
      .swagger-ui section.models .model-container { background: #111; }
      .swagger-ui .model-box { background: #1a1a1a; }
    `,
  });

  await app.listen(process.env.PORT ?? 3000);

  console.log(
    `\n🚀 API Gateway running at: http://localhost:${process.env.PORT ?? 3000}`,
  );
  console.log(
    `📖 Swagger docs at:        http://localhost:${process.env.PORT ?? 3000}/docs\n`,
  );
}
bootstrap();
