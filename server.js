const express = require('express');
const OpenAIChatController = require('./chatgpt'); // Import your class

const app = express();
const port = 3000; // You can use any port that is free on your system

app.use(express.json()); // Middleware to parse JSON bodies

// Initialize the chat controller
const chatController = new OpenAIChatController();
chatController.initialize();
// Endpoint to initialize the browser and page
// app.post('/initialize', async (req, res) => {
//     try {
//         await chatController.initialize();
//         res.status(200).send('Initialized');
//     } catch (error) {
//         res.status(500).send(error.message);
//     }
// });

// Store client responses to resolve when 'end_turn' is emitted
let pendingResponses = [];

// Add a listener for the 'end_turn' event within the OpenAIChatController
chatController.on('end_turn', (content) => {
    // Send the response back to all pending clients
    pendingResponses.forEach(res => res.send(content));
    pendingResponses = []; // Clear the responses after sending
});

// Endpoint to initialize the page
// this will open a new browser window of the chat and following requests will be in the same new chat
app.post('/new_page', async (req, res) => {
    try {
        // read request
        const { closeOtherTabs } = req.body;
        
        await chatController.newPage(closeOtherTabs);
        res.status(200).send('New page created');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Endpoint to click new chat button
app.post('/new_chat', async (req, res) => {
    try {
        await chatController.clickNewChatButton();
        res.status(200).send('New chat clicked');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Endpoint to send a message
app.post('/text', async (req, res) => {
    const { message } = req.body;
    try {
        console.log(message);
        await chatController.typeIntoPrompt(message);
        res.status(200).send('prompt typed');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Endpoint to upload an image
app.post('/upload', async (req, res) => {
    const { filePath } = req.body;
    try {
        await chatController.uploadImage(filePath);
        res.status(200).send('Image uploaded');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Endpoint to click the send button
app.post('/send', async (req, res) => {
    try {
        await chatController.clickSendButton();

        // Store the response object to resolve later
        pendingResponses.push(res);

        // Optionally add a timeout to release the response
        setTimeout(() => {
            if (pendingResponses.includes(res)) {
                res.send('Timeout: No response received.');
                pendingResponses = pendingResponses.filter(r => r !== res);
            }
        }, 60000); // 30-second timeout

    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Endpoint to close the browser
app.post('/close', async (req, res) => {
    try {
        await chatController.close();
        res.status(200).send('Closed');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
