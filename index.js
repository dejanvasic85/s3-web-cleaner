const AWS = require('aws-sdk');
AWS.config.update({ region: process.env.AWS_REGION || 'ap-southeast-2' });

const bucket = process.env.AWS_BUCKET;
const { 
  cleanDeployment, 
  deleteDeployment, 
  getDeploymentsToClean 
} = require('./deploymentManager');

async function start() {
  const deployments = await getDeploymentsToClean(bucket);
  console.log('Deployments to clean', deployments);

  deployments.forEach(async (deployment) => {
    await cleanDeployment(bucket, deployment);
    await deleteDeployment(bucket, deployment);
  })
}

start();