export const handleTerminalCreation = (container, ws) => {
    container.exec({
        CMD: ['/bin/bash'],
        AttachStdin: true,
        AttachStdout: true,
        AttachStderr: true,
        Tty: true,
        User: "sandbox",

    }, (err, exec) => {
        if(err){
            console.log("error while creating exec", err);
            return;
        }

        exec.start({
            hijack: true
        }, (err, stream) => {
            if(err){
                console.log("error while creating exec", err);
                return;
            }

            // step 1: Stream processing
            processStreamOutput(stream, ws);

            // Stream writing
            ws.on("message", (data) => {
                if(data == "getPort"){
                    container.inspect((err, data) => {
                        const port = data.NetworkSettings;
                        console.log(port);
                    });
                    return;
                }
                stream.write(data);
            })
        })
    })
}

function processStreamOutput(stream, ws) {
    let nextDataType = null; // Type of next message
    let nextDataLength = null; // Length of next message
    let buffer = new Buffer.from("");

    function processStreamData(data) {
        if (data) {
            buffer = Buffer.concat([buffer, data]); // Append incoming data
        }

        if (!nextDataType) {
            if (buffer.length >= 8) {
                const header = bufferSlicer(8);
                nextDataType = header.readUInt32BE(0); // Read message type
                nextDataLength = header.readUInt32BE(4); // Read message length
                processStreamData(); // Process next message
            }
        } else {
            if (buffer.length >= nextDataLength) {
                const content = bufferSlicer(nextDataLength);
                ws.send(content); // Send to client
                nextDataType = null;
                processStreamData(); // Process next message
            }
        }
    }

    function bufferSlicer(end) {
        const output = buffer.slice(0, end);
        buffer = Buffer.from(buffer.slice(end)); // Update buffer
        return output;
    }

    stream.on("data", processStreamData);
}
