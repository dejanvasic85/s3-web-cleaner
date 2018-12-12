const AWS = require('aws-sdk');
const moment = require('moment');
const s3 = new AWS.S3();

async function getDeploymentsToClean(bucketName) {
  var params = {
    Bucket: bucketName,
    Delimiter: '/',
  };

  const listResponse = await s3.listObjects(params).promise();
  const directories = listResponse.CommonPrefixes.map(p => p.Prefix.replace('/', ''));
  const lastDeployment = getLastDeployment(directories);
  
  const deploymentsToClean = directories
    .filter(d => d.startsWith('20') && !d.startsWith(lastDeployment));

  if (!deploymentsToClean) {
    return [];
  }

  return deploymentsToClean;
}

const getLastDeployment = (directories) => {
  let latest = ''
  directories
    .filter(dirName => dirName.startsWith('20'))
    .forEach(d => {
      const currentDate = moment();
      if (!currentDate.isValid()) {
        return;
      }

      if (latest === '') {
        latest = d;
      }

      if (moment(latest).isBefore(moment(d))) {
        latest = d;
      }
    });

  return latest;
}

async function cleanDeployment(bucket, dir) {
  const listParams = {
    Bucket: bucket,
    Prefix: dir
  };

  const listedObjects = await s3.listObjectsV2(listParams).promise();

  if (listedObjects.Contents.length === 0) {
    return;
  }

  const deleteParams = {
    Bucket: bucket,
    Delete: { Objects: [] }
  };

  listedObjects.Contents.forEach(({ Key }) => {
    deleteParams.Delete.Objects.push({ Key });
  });

  // Webpack plugin also retains the index files with date stamps, so add this manually
  const indexHtmlKey = `index-${dir}.html`;
  deleteParams.Delete.Objects.push({Key: indexHtmlKey});

  console.log(`Removing ${deleteParams.Delete.Objects.length} items from ${dir}`);
  await s3.deleteObjects(deleteParams).promise();

  if (listedObjects.Contents === 1000) {
    await cleanDeployment(bucket, dir);
  }
}

async function deleteDeployment(bucket, key) {
  // Removes the empty folder
  const deleteParams = {
    Bucket: bucket,
    Key: key
  };
  
  await s3.deleteObject(deleteParams);
}

module.exports = {
  deleteDeployment,
  cleanDeployment,
  getDeploymentsToClean,
}