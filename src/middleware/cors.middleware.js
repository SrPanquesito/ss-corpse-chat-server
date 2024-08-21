let allowlist = []

try {
    allowlist = process.env.ALLOW_LIST ? JSON.parse(process.env.ALLOW_LIST) : []
} catch (error) {
    console.error('Failed to parse ALLOW_LIST:', error)
}

const corsOptions = {
    origin: allowlist,
    optionsSuccessStatus: 200, // For legacy browser support
}

module.exports = { corsOptions }
