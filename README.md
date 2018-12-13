S3 Web Cleaner
===

Are you using create-react-app with [s3-plugin-webpack](https://github.com/MikaAK/s3-plugin-webpack) 
to deploy your webpack project? After number of deployments it tends to leave a lot of 
the previous files and directories behind. Running `node index.js` in this app 
should help clean it up.

### Running the app

Set your AWS credentials (key and secret) using environment variables.
Also set:

- AWS_REGION

- AWS_BUCKET

Example:

```
AWS_REGION=ap-southeast-2 AWS_BUCKET=my-super-web-app node index.js
```

### Running with Docker

This has already been containerised and pushed to : dejanvasic/s3-web-cleaner.
So you can run as follows:

```
docker run --rm --env-file .env dejanvasic/s3-web-cleaner:1.0.0 
```

Where the --env-file should read in the AWS config.