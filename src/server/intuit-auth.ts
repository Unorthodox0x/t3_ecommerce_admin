import { OAuthClient, Token, AuthResponse } from "intuit-oauth";

export async function generateToken():Promise<Token> {
  //authorization uri
  const authUri:string = oauthClient.authorizeUri({
    scope: [OAuthClient.scopes.Accounting, OAuthClient.scopes.OpenId],
  });

  const response:AuthResponse = await oauthClient.createToken(authUri);
  return response.getToken();

} 

export const configOptions = {
  scope: [OAuthClient.scopes.Accounting, OAuthClient.scopes.OpenId],
  realmId: process.env.QUICKBOOKS_REALM_ID,
  validWindow: 3600, //1hour 
  expireOffset: 120, // 5 mins
}

export const qbConfigJson: OAuthClient.OAuthClientConfig = {
  clientId: process.env.QUICKBOOKS_CLIENT_ID as string,
  redirectUri: process.env.QUICKBOOKS_CALLBACK_URL as string,
  clientSecret: process.env.QUICKBOOKS_CLIENT_SECRET as string,
  environment: process.env.QUICKBOOKS_ENVIRONMENT as string,
  logging: true,
  Token: await generateToken(),
};

export const oauthClient = new OAuthClient(qbConfigJson);