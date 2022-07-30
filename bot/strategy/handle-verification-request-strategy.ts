import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { HandleRequestStrategy } from "./handle-request-strategy";

export class HandleVerificationRequestStrategy implements HandleRequestStrategy {
    async handle(request: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
        let queryStrings = request.queryStringParameters || {};

        const verifyToken = queryStrings['hub.verify_token'];
        const challenge = queryStrings['hub.challenge'];
        const requestValid = (verifyToken == 'aStrongToken') && (challenge != undefined);

        if (requestValid) {
            return {
                statusCode: 200,
                body: challenge
            }
        } else {
            return {
                statusCode: 403,
                body: ''
            }
        }
    }
}