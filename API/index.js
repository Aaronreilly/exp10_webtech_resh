
module.exports = (req, res) => {
    res.setHeader("Content-Type", "text/html");

    res.status(200).send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Node.js Server</title>
        </head>
        <body>
            <h1>Welcome to Node.js!</h1>
            <p>This is a server-side application.</p>
            <p>Request URL: ${req.url}</p>
            <p>Request Method: ${req.method}</p>
        </body>
        </html>
    `);
};
