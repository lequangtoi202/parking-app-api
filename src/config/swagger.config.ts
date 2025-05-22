import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export const swaggerConfig = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle('Parking App')
    .setDescription(
      `The Parking app API.
     <h1>Looking for the graphql api?</h1>
Go to <a href="/graphql" target="_blank">/graphql</a>.
Or,
You might also need to use the <a href="https://studio.apollographql.com/sandbox/explorer?endpoint=http://localhost:3000/graphql" target="_blank">Apollo explorer</a> for a great experience`,
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/swagger', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });
};
