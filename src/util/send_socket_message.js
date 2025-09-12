

const sendSocketMessage = (socketMessage, sessionId, callAPI) => {
    

    async function sendSocketMessage () {
        console.log('sending Message from canvas: ', socketMessage )
        const response = await callAPI(
            {
                url: "/canvas/send_socket_message",
                method: "POST",
                body: {session_id: sessionId, message: socketMessage},
                headers: {
                    "Content-Type": "application/json",
                }
            },
            "json"
        )
        return response;

        
    }

    sendSocketMessage()
            .then(response => {return response})
        
}

export default sendSocketMessage