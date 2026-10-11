const baseUrl = process.env.NODE_ENV === 'production'
    ? 'https://minhassenhas-back.herokuapp.com'
    : 'http://localhost:3000'

export default {
    API_URL: `${baseUrl}/api`,
    OAPI_URL: `${baseUrl}/oapi`,
}
  
