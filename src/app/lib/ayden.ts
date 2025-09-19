import { Client, CheckoutAPI, Types } from "@adyen/api-library"
import { EnvironmentEnum } from "@adyen/api-library/lib/src/config";


export const getAydenClient = () => {
    const client = new Client({
        apiKey: process.env.ADYEN_API_KEY!,
        environment: EnvironmentEnum.TEST
    });

    const checkoutApi = new CheckoutAPI(client);
    return { client, checkoutApi };
}

export { Types };
