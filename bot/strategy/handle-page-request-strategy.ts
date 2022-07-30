import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { HandleRequestStrategy } from "./handle-request-strategy";
import axios from 'axios';

export class HandlePageRequestStrategy implements HandleRequestStrategy {
    async handle(request: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
        
        const body = JSON.parse(request.body || '{}');
        const entries = body['entry'];

        const accessToken = 'YOUR_ACCESS_TOKEN_HERE';
        const endpoint = `https://graph.facebook.com/v14.0/me/messages?access_token=${accessToken}`;
        let errorOccurred = false;

        for (let entry of entries) {
            // Each entry contains only a message
            const receivedMessage = entry.messaging[0];

            console.log(`Received the following message: ${JSON.stringify(receivedMessage)}`);

            // Send a reponse to the user
            try {
                console.log('Calling APIs to answer to the user');
                const response = await axios.post(endpoint, {
                    messaging_type: 'RESPONSE',
                    recipient: {
                        id: receivedMessage.sender.id
                    },
                    message: {
                        text: `Thank you for contacting our bot. Your message is: ${receivedMessage.message.text}`
                    }
                });
                console.log(`Response from the call to axios: ${response.status} - ${response.statusText}`);
            } catch (err) {
                console.log(err);
                errorOccurred = true;
                break;
         
            }
        }

        return {
            statusCode: errorOccurred ? 500 : 200,
            body: errorOccurred ? 'An error occurred' : 'Messages sent'
        }

    }
}