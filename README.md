S3 Web Cleaner
===

Are you using [s3-plugin-webpack](https://github.com/MikaAK/s3-plugin-webpack) 
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