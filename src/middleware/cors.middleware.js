const allowlist = [
    'http://example1.com',
    'http://localhost:4000'
];

const corsOptions = {
    origin: allowlist,
    optionsSuccessStatus: 200 // For legacy browser support
};

module.exports = {corsOptions};