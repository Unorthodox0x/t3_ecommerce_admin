/**
 * This file is a backup 
 * 
 * In case of node_modules folder deletion
 * create an index.d.ts filt in "@root/node_modules/intuit-oauth"
 * include line "types": "index.d.ts", in node_moduels/intuit-oauth/package.json
 */ 

import csrf from "csrf";
declare module "intuit-oauth" {

    class AuthResponse {
        constructor(params: AuthResponse.AuthResponseParams);
        processResponse(response: object): void;
        getToken(): Token;
        text(): string;
        status(): number;
        headers(): object;
        valid(): boolean;
        getJson(): object;
        get_intuit_tid(): string;
        isContentType(): boolean;
        getContentType(): string;
        isJson(): boolean;
    }

    namespace AuthResponse {
        export interface AuthResponseParams {
            Token?: Token;
            response?: Response;
            body?: string;
            json?: object;
            intuit_tid?: string;
        }
    }

    class Token implements Token.TokenData {
        latency: number;
        realmId: string;
        Token_type: string;
        access_Token: string;
        refresh_Token: string;
        expires_in: number;
        x_refresh_Token_expires_in: number;
        id_Token: string;
        createdAt: string;
        accessToken(): string;
        refreshToken(): string;
        TokenType(): string;
        getToken(): Token.TokenData;
        setToken(TokenData: Token.TokenData): Token;
        clearToken(): Token;
        isAccessTokenValid(): boolean;
        isRefreshTokenValid(): boolean;
    }

    namespace Token {
        export interface TokenData {
            realmId?: string;
            Token_type?: string;
            access_Token?: string;
            refresh_Token?: string;
            expires_in: number;
            x_refresh_Token_expires_in: number;
            id_Token?: string;
            latency: number;
            createdAt: string;
        }
    }

    class OAuthClient {
        constructor(config: OAuthClient.OAuthClientConfig);
        authHeader(): string;
        authorizeUri(params: OAuthClient.AuthorizeParams): string;
        createError(e: Error, AuthResponse?: AuthResponse): OAuthClient.OAuthClientError;
        createToken(uri: string): Promise<AuthResponse>;
        getKeyFromJWKsURI(id_Token: string, kid: string, request: Request): Promise<object | string>;
        getTokenRequest(request: Request): Promise<AuthResponse>;
        getUserInfo(params?: OAuthClient.GetUserInfoParams): Promise<AuthResponse>;
        isAccessTokenValid(): boolean;
        loadResponse(request: Request): Promise<Response>;
        loadResponseFromJWKsURI(request: Request): Promise<Response>;
        log(level: string, message: string, messageData: any): void;
        makeApiCall(params?: OAuthClient.MakeApiCallParams): Promise<AuthResponse>;
        refresh(): Promise<AuthResponse>;
        refreshUsingToken(refresh_Token: string): Promise<AuthResponse>;
        revoke(params?: OAuthClient.RevokeParams): Promise<AuthResponse>;
        setToken(params: Token.TokenData): Token;
        validateIdToken(params?: OAuthClient.ValidateIdTokenParams): Promise<Response>;
        validateToken(): void;
    }

    namespace OAuthClient {
        export interface OAuthClientConfig {
            clientId: string;
            clientSecret: string;
            redirectUri?: string;
            environment?: string;
            Token: Token;
            logging: boolean;
        }

        export enum environment {
            sandbox = 'https://sandbox-quickbooks.api.intuit.com/',
            production = 'https://quickbooks.api.intuit.com/'
        }

        export enum scopes {
            Accounting = 'com.intuit.quickbooks.accounting',
            Payment = 'com.intuit.quickbooks.payment',
            Payroll = 'com.intuit.quickbooks.payroll',
            TimeTracking = 'com.intuit.quickbooks.payroll.timetracking',
            Benefits = 'com.intuit.quickbooks.payroll.benefits',
            Profile = 'profile',
            Email = 'email',
            Phone = 'phone',
            Address = 'address',
            OpenId = 'openid',
            Intuit_name = 'intuit_name'
        }

        export interface AuthorizeParams {
            scope: scopes | scopes[] | string;
            state?: csrf;
        }

        export interface RevokeParams {
            access_Token?: string;
            refresh_Token?: string;
        }

        export interface GetUserInfoParams { }

        export interface MakeApiCallParams {
            url: string;
        }

        export interface ValidateIdTokenParams {
            id_Token?: string;
        }

        export interface OAuthClientError extends Error {
            intuit_tid: string;
            AuthResponse: AuthResponse;
            originalMessage: string;
            error_description: string;
        }
    }
}