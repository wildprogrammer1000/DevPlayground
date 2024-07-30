const webPush = require("web-push");

const keys = webPush.generateVAPIDKeys();
console.log("=============== VAPID KEYs =============== ");
console.log(keys);
console.log("========================================== ");
