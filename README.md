## AWS lambda resource for tfinjs


### Usage


**Definition**

```javascript

import { resource as awsLambda } from '@tfinjs/aws-lambda';
import lambdaDeploymentBucket from './lambdaDeploymentBucket';
import api from './api';

const petLambdas = awsLambda(api, 'petLambdas', {
  cloudwatch: true,
  apigw: {
    enabled: true,
    cors: true,
    path: '*/*',
  },
  s3DeploymentBucket: api.reference(lambdaDeploymentBucket, 'id'),
  entry: {
    path: join(__dirname, './service.js'),
    export: 'handler'
  }
  /* byotranspiler */
  /* given the input file path, transpile the input into some output file content which path should be returned */
  /* if you dont want to transpile the file, just return the fs.readFileSync(inputFilePath, 'binary'); buffer */
  /* If you use some env files you can transpile using webpack and the env provider plugin such that you can use the api during runtime */
  build: async (inputFilePath) => {
    return fs.readFileSync(inputFilePath, 'binary');
  }
});

export default lambda;

```
**Reference the arn in lambdas**
```javascript
/* service.js */
import { getArn } from '@tfinjs/aws-lambda';
import api from './target-lambda/api';

const arn = getArn(api, 'petLambda', 'queue');
```

