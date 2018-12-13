const AWS = require('aws-sdk');
const config = require('./config');
AWS.config.update({ 
  region: config.awsRegion,
  credentials: {
    accessKeyId: config.awsAccessKeyId,
    secretAccessKey: config.awsSecretAccessKey
  }
});

const {
  cleanDeployment,
  deleteDeployment,
  getDeploymentsToClean
} = require('./deploymentCleaner');

async function start() {
  const deployments = await getDeploymentsToClean(config.bucket);
  console.log('Deployments to clean', deployments);

  if (deployments.length > 0) {
    deployments.forEach(async (deployment) => {
      await cleanDeployment(config.bucket, deployment);
      await deleteDeployment(config.bucket, deployment);
    })
  }
}

start();