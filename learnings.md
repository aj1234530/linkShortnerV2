# 1. NGROK | ip-api | 
# 2. user-agent in headers host to know the device(just log the req.headers.host)
# 3. req.ip, and req.connection.remoteAddress(depcrecated) prefer req.socket(https://www.geeksforgeeks.org/express-js-req-ip-property/),(https://www.geeksforgeeks.org/node-js-request-socket-property/)
     (const ip = req.headers["x-forwarded-for"] || req.socket;)