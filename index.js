const AWS = require('aws-sdk');
AWS.config.update({ region: process.env.AWS_REGION || 'ap-southeast-2' });

const bucket = process.env.AWS_BUCKET || 'anteup-web-dev';
const { cleanDeployment, deleteDeployment, getDeploymentsToClean } = require('./deploymentManager');

async function start() {
  const deployments = await getDeploymentsToClean(bucket);
  console.log('Deployments to clean', deployments);

  deployments.forEach(d => {
    await cleanDeployment(d);
    await deleteDeployment(bucket, d + '/');
  });
}

start();