module.exports = {
    secret:     process.env.NODE_ENV === "production" ? process.env.SECRET : "encryptLucas55412544",
    api:        process.env.NODE_ENV === "production" ? "https://api.loja-teste.ampliee.com" : "http://localhost:3000",
    store:      process.env.NODE_ENV === "production" ? "https://loja-teste.ampliee.com" : "http://localhost:8000",
}
