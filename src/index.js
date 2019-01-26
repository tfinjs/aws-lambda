import { resolve } from 'path';
import { mkdirpSync } from 'fs-extra';
import {
  versionedName,
  reference,
  Resource,
  DeploymentConfig,
} from '@tfinjs/api';

const relativeZipFilePath = './aws_lambda_package.zip';

const getS3Key = (r) => `${r.versionedName()}.zip`;

class LambdaResource {
  constructor(
    deploymentConfig,
    name,
    {
      lambdaDeploymentBucket,
      package: packageFunction,
      timeout = 30,
      memorySize = 512,
    },
  ) {
    if (!(deploymentConfig instanceof DeploymentConfig)) {
      throw new Error(
        'Error you have two versions of @tfinjs/api in you node_modules, @tfinjs/aws-lambda is not using the same version as your project',
      );
    }
    const role = new Resource(deploymentConfig, 'aws_iam_role', name, {
      assume_role_policy: JSON.stringify({
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'sts:AssumeRole',
            Principal: {
              Service: 'lambda.amazonaws.com',
            },
            Effect: 'Allow',
            Sid: '',
          },
        ],
      }),
    });

    const zipUpload = new Resource(
      deploymentConfig,
      'aws_s3_bucket_object',
      name,
      {
        bucket: reference(lambdaDeploymentBucket, 'id'),
        key: getS3Key,
        source: relativeZipFilePath,
        content_type: 'application/zip',
      },
    );

    zipUpload.addPreBuildHook(async (r) => {
      const outputFolder = resolve(r.getProject().getDist());
      mkdirpSync(outputFolder);
      await packageFunction(
        resolve(outputFolder, r.versionedName(), relativeZipFilePath),
      );
    });

    const lambda = new Resource(
      deploymentConfig,
      'aws_lambda_function',
      name,
      {
        function_name: versionedName(),
        s3_key: getS3Key(zipUpload),

        s3_bucket: reference(lambdaDeploymentBucket, 'id'),

        handler: 'service.handler',
        runtime: 'nodejs8.10',

        timeout,
        memory_size: memorySize,

        role: reference(role, 'arn'),

        description: `tfinjs-aws-lambda/${name}`,
      },
      {
        dependsOn: [zipUpload],
      },
    );

    return {
      lambda,
      zipUpload,
      role,
    };
  }
}

export default LambdaResource;
