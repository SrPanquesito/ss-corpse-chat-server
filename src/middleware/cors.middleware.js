const allowlist = [
    'http://corpsechat.com',
    'https://corpsechat.com',
    'http://www.corpsechat.com',
    'https://www.corpsechat.com',
    'http://localhost:4000',
]

const corsOptions = {
    origin: allowlist,
    optionsSuccessStatus: 200, // For legacy browser support
}

module.exports = { corsOptions }
