import {WebSocketServer,WebSocket} from "ws";

const wss=new WebSocketServer({port:8080});

let senderSocket : null | WebSocket=null;
let receiverSocket : null | WebSocket =null;

wss.on("connection", function connection(ws) {
    ws.on('message', function message(data:any){
        const message=JSON.parse(data);

        if(message.type === "identify-as-sender"){
            senderSocket=ws;
        }
        else if( message.type === "identify-as-receiver"){
            receiverSocket=ws;
        }
        else if( message.type == "create-offer"){
            if(!receiverSocket){
                return;
            }
            receiverSocket.send(JSON.stringify({type:"offer",offer:message.offer} ));
            }
        else if(message.type === "create-answer"){
            if(!senderSocket){
                return ;
            }

            senderSocket.send(JSON.stringify({type:"offer", offer:message.offer}));
        }

        else if(message.type === "addIceCandidate"){
            if( ws === senderSocket){
                receiverSocket?.send(JSON.stringify({type:"iceCandidate",candidate:message.candidate}))
            } 
            else if(ws === receiverSocket){
                senderSocket?.send(JSON.stringify({type:"iceCandidate",candidate:message.candidate}));
            }
        }
        

        //identifi-as-sender
        //identifi-as-receiver
        //create offer 
        //create answer
        // add candidate 
        console.log(message);
    })
})
 