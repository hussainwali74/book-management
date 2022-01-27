import 'dotenv/config';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // --------------------------------------------------------------------------- SwaggerDocs
  // swaggerUI
  const options = new DocumentBuilder()
    .setTitle('book management')
    .setDescription('documentation of Book Management API')
    .setVersion('1.0.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'bearer' },
      'token',
    )
    .addServer('http://localhost:' + process.env.port)
    .build();
  const document = SwaggerModule.createDocument(app, options);

  const options2 = {
    // customCss: '.swagger-ui .topbar { display: none }'
    customCss: `
      .topbar-wrapper img {content:'Book Management'; width:300px; height:auto;}
      .swagger-ui .topbar { background-color: white; }
      ..renderedMarkdown {
        color: #26eee7;
      }
      .swagger-ui .model .property.primitive {
          color: #b02323;
      }
          `,
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: 'Book Management API Docs',
  };

  SwaggerModule.setup('docs', app, document, options2);
  // --------------------------------------------------------------------------- SwaggerDocs end
  // Request body Validation
  app.useGlobalPipes(new ValidationPipe());


  await app.listen(process.env.port || 3000, '0.0.0.0', function () {
    console.log('listening on port: ' + process.env.port || 3000);
  });
}
bootstrap();
