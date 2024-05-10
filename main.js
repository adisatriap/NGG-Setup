const awsIot = require('aws-iot-device-sdk')
const moment = require('moment-timezone')

// Variables for setup IoT Device
const clientId = 'Adi-NGG-10Meit'
const groupName = 'Adi-NGG-25'
const host = 'af6jtu8gr8wfx-ats.iot.ap-southeast-1.amazonaws.com'
const healthCheckTopic = 'Adi-NGG-10Meit/health-check'
const healthCheckInterval = 10 // 10 seconds

// Reading certificate files
const keyPath = 'certs/private.pem.key'
const certPath = 'certs/certificate.pem.crt'
const caPath = 'certs/AmazonRootCA1.pem'

const device = awsIot.device({
  keyPath,
  certPath,
  caPath,
  clientId,
  host
})

device
  .on('connect', async () => {
    // Subscribe and then publish to health check topic
    device.subscribe(healthCheckTopic)

    healthCheckPublish(device)
    setInterval(
      () => { healthCheckPublish(device) },
      healthCheckInterval * 1000
    )
  })

function healthCheckPublish (device) {
  // Format the date in SGP Timezone (e.g., "2024-05-08T14:36:42.273+08:00")
  const currentDate = moment().tz('Asia/Singapore').format('YYYY-MM-DD HH:mm:ss')
  const healthCheckPayload = {
    status: 'TEST',
    device: clientId,
    timeStamp: currentDate,
    group: groupName
  }
  device.publish(healthCheckTopic, JSON.stringify(healthCheckPayload))
}
