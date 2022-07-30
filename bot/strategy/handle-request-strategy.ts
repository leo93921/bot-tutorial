import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export interface HandleRequestStrategy {
    handle(request: APIGatewayProxyEvent): Promise<APIGatewayProxyResult>;
}