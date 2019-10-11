import authorizationService from './authorization';

const graphql = (params) => {
    const apiBase = new URL('/graphql', location.origin).toString();

    const token = authorizationService.getAuthorizationToken();
    const headers = {
        'Content-Type': 'application/json',
        authorization: token ? `Bearer ${token}` : ''
    }

    return fetch(apiBase, {
        method: 'POST',
        credentials: 'include',
        headers: new Headers(headers),
        body: JSON.stringify({
            query: params.query,
            variables: params.variables ? params.variables : {}
        })
    })
        .then(res => res.json())
        .then(res => {
            return res.data;
        });
}
export default {
    graphql
};