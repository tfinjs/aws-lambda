import { resolve } from 'path';
import { mkdirpSync } from 'fs-extra';
import { versionedName, reference, Resource } from '@tfinjs/api';

const getRelativeZipFilePath = (r) =>
  `./${r.versionedName()}/.webpack/package.zip`;

class LambdaResource {
  constructor(
    deploymentConfig,
    name,
    {
      lambdaDeploymentBucket,
      package: packageFunction,
      export: exportName,
      timeout = 30,
      memorySize = 512,
    },
  ) {
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

    const lambda = new Resource(deploymentConfig, 'aws_lambda_function', name, {
      function_name: versionedName(),
      s3_key: versionedName(),

      s3_bucket: reference(lambdaDeploymentBucket, 'id'),

      handler: `service.${exportName}`,
      runtime: 'nodejs8.10',

      timeout,
      memory_size: memorySize,

      role: reference(role, 'arn'),

      description: `tfinjs-aws-lambda/${name}`,
    });

    const zipUpload = new Resource(
      deploymentConfig,
      'aws_s3_bucket_object',
      name,
      {
        bucket: reference(lambdaDeploymentBucket, 'id'),
        key: versionedName(),
        source: getRelativeZipFilePath,
        content_type: 'application/zip',
      },
    );

    zipUpload.addPreBuildHook(async (r) => {
      const outputFolder = resolve(r.getProject().getDist());
      mkdirpSync(outputFolder);
      await packageFunction(resolve(outputFolder, getRelativeZipFilePath(r)));
    });

    return {
      lambda,
      zipUpload,
      role,
    };
  }
}

export default LambdaResource;
