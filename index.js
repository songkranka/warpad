const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger_output.json')
const bodyParser = require('body-parser')
const express = require('express')
const app = express();
const configs = require('./configs/app')
const configMap = require('./configs/configMap');
const logger = require('./utilities/logger');
const cors = require('cors');
const webpush = require('web-push');
const impService = require('./services/import_master');
const empService = require('./services/employee');

app.use(bodyParser.json({ limit: '50mb' }));
// if (process.env.NODE_ENV === "production") {
//   app.use('/doc', (req, res, next) => {
//     res.status(404).send("You do not have permission to access this resource")
//     return next();
//   });
// } else {
//   app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));
// }
app.use('/doc', (req, res, next) => {
  res.status(404).send("You do not have permission to access this resource")
  return next();
});
app.use(cors());

var USER_SUBSCRIPTIONS = [];

const vapidKeys = {
  publicKey:
    'BK69naxORWEhF74lrpNW3rmYlL_A0A2xXPZuT_m3v8Vv4Wv8_6qGiVc4CvnSczJoh8906JG7xR-Ak6kQt9Z1mQ4',
  privateKey: '-OLUBZx5c_wm8gqiqod3fDiDLXN8GXFOqtnZjor634I',
};

webpush.setVapidDetails(
  'mailto:example@yourdomain.org',
  vapidKeys.publicKey,
  vapidKeys.privateKey,
);

app.post('/api/subscribe', async (req, res) => {
  const subscription = req.body;
  USER_SUBSCRIPTIONS = [];
  console.log(subscription);
  USER_SUBSCRIPTIONS.push(subscription);
  console.log(USER_SUBSCRIPTIONS);
  res.status(201).json(subscription);
});

app.post('/api/notifications', async (req, res) => {
  // console.log('notifications :: ', req.body);
  const notificationPayload = req.body;

  const promises = []
  USER_SUBSCRIPTIONS.forEach(subscription => {
    promises.push(
      webpush.sendNotification(
        subscription,
        JSON.stringify(notificationPayload)
      )
    )
  });
  Promise.all(promises).then(() => res.sendStatus(200))
});

const server = app.listen(configs.port, () => {
  try {
    logger.info("################# STATION-WARPAD-TASK-API #################");
    logger.info("API is running!");
    logger.info("Url : " + configs.base_url.concat('/doc'));
    initial();
  }
  catch (error) {
    logger.error("API Have Error => " + error);
  }
})

const io = require('socket.io')(server, {
  maxHttpBufferSize: 50e8,
  pingTimeout: 60000,
  cors: {
    origin: "*",
  }
});
io.on('connection', (socket) => {
  console.log("A user is connected: " + socket.id);
  socket.on('auth', async (message) => {
    let ds = JSON.parse(message);
    if (ds.userId) {
      await empService.updateEmpSplitter(ds);
    }
  })
  socket.on('add-excel-file', async (message) => {
    let ds = JSON.parse(message);
    ds = Object.assign(ds, {status: 'Waiting'})
    await impService.addVendingMachineFile(ds);
  });
  socket.on('update-excel-file', async (message) => {
    await impService.updateMachineFile({
      uid: message.uid,
      status: message.status,
      userId: message.userId
    })
  });
  socket.on('add-excel-data', async (message) => {
    let dsArray = JSON.parse(message);
    for (const [index, value] of dsArray.entries()) {
      const result = await impService.addVendingMachine(value);
      if (result.rowsAffected[0] === 1) {
        let percent = (((index+1) / dsArray.length) * 100).toFixed(2);
        if (parseInt(percent) === 100) {
          await impService.updateMachineFile({uid: value.uid, status: 'Success', userId: value.userId});
          const res = await impService.getNotificationSocFile(value.userId);
          if (res.length !== 0) {
            await io.emit('get-notification-upload', res)
          }
          await impService.sendLineNotifyAdmin({file: value.fileName, uid: value.userId});
          await io.emit('send-notification', {
            notification: {
              title: 'Notifications are Upload File',
              body: `File upload completed.`,
              vibrate: [100,50,100],
              data: {
                url: 'https://dev-stationwarpad.pt.co.th/backend/home'
              }
            }
          });
        }
      }
    }
  });
  socket.on('send-notification', async (message) => {
    if (message !== null) {
      socket.emit('send-notification', message);
      socket.broadcast.emit('send-notification', message);
    }
  })
  socket.on('get-notification', async (message) => {
    let ds = JSON.parse(message);
    if (ds !== null) {
      const res = await impService.getNotificationSocFile(ds.userId);
      if (res.length !== 0) {
        await io.emit('get-notification-upload', res)
      }
    }
  });
  socket.on('get-notification-upload', async (message) => {
    let ds = JSON.parse(message);
    if (ds !== null) {
      socket.emit('get-notification-upload', ds);
      socket.broadcast.emit('get-notification-upload', ds);
    }
  });
  socket.on('read-notification-upload', async (message) => {
    let ds = JSON.parse(message);
    if (ds !== null) {
      const result = await impService.updateNotificationSocFile(ds);
      if (result.rowsAffected[0] === 1) {
        const res = await impService.getNotificationSocFile(ds.userId);
        if (res.length !== 0) {
          await io.emit('get-notification-upload', res);
        } else {
          await io.emit('get-notification-upload', res);
        }
      }
    }
  })
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
})

async function initial() {
  try {
    logger.info("Begin | Load Configure from Configmap Process");

    // await configMap.loadConfig(configs.query_config);
    // logger.info("Query Config has been loaded");

    await configMap.loadConfig(configs.message_config);
    logger.info("Message Config has been loaded");
    // await configMap.loadConfig(configs.api_mapper_Config);
    // logger.info("API Mapping Config has been loaded");

    // await configMap.loadConfig(configs.web_url_config);
    // logger.info("Web URL Config has been loaded");

    logger.info("End | Load Configure from Configmap");
  }
  catch (error) {
    logger.error("Load Configure from Configmap have error : " + error);
  }
}

var router = require('./routes')();
app.use('/', router);