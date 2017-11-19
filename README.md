# wosbot
Automatic NodeJS bot, that takes free ad spaces on wos.lv

**Required NodeJS packages:**
 * cluster
 * antigate
 * node-horseman
 * node-jsdom
 * request
 * JSON
 * moment-timezone
 * delayed
 * child_process
 * simple-node-logger
 * forever (to launch it in background)
 
**How to use it:**
 1. Download wos_worker.js, listner.js and banner.png (If you want to use other banner, size needs to be 88x53, and file name - banner.png)
 2. Place all 3 files in same directory
 3. Edit x_apicode and x_website in wos_worker.js with anti-captcha api code and website
 4. Launch listner.js

Bot will create log file called wos.log (small information about bot process).
