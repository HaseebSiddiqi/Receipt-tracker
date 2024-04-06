import { CognitoUserPool } from 'amazon-cognito-identity-js';


const poolData = {
    UserPoolId: "ca-central-1_OAWm9E9Wc",
    ClientId: "5hc8jgjr5b7vh5jf9qhkmv46l8"
};


export default new CognitoUserPool(poolData);