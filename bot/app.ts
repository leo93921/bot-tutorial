import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { HandlePageRequestStrategy } from './strategy/handle-page-request-strategy';
import { HandleRequestStrategy } from './strategy/handle-request-strategy';
import { HandleVerificationRequestStrategy } from './strategy/handle-verification-request-strategy';

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    const queryParams = event.queryStringParameters;
    let handleRequestStrategy: HandleRequestStrategy;

    console.log(`Received event: ${JSON.stringify(event)}`);

    if (event.httpMethod == 'GET' && queryParams && queryParams['hub.mode'] == 'subscribe') {
        console.log('Verifing the request');

        handleRequestStrategy = new HandleVerificationRequestStrategy();
        return handleRequestStrategy.handle(event);
    }

    // Let's now handle the messages sent by the user
    if (event.httpMethod == 'POST' && event.body) {
        console.log('Handling messages sent by the user');

        const body = JSON.parse(event.body);
        if (body['object'] == 'page') {
            handleRequestStrategy = new HandlePageRequestStrategy();
            return handleRequestStrategy.handle(event);
        }
    }

    console.log('Unable to process the request');
    return {
        statusCode: 500,
        body: 'Unable to process the request'
    }

};
