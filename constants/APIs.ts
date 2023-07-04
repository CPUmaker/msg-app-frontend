export const BASE_DOMAIN = "http://localhost:3000"

export const endpoints = {
    register: BASE_DOMAIN + "/auth/register",
    login: BASE_DOMAIN + "/auth/login",
    checkValid: BASE_DOMAIN + "/auth/check-valid",
    graphql: BASE_DOMAIN + "/graphql",
    graphqlSubscript: `ws://${BASE_DOMAIN.split("://")[1]}/graphql/subscriptions`,
};
