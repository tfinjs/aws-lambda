provider "aws" {
  assume_role = {
    role_arn = "arn:aws:iam::13371337:role/DeploymentRole"
  }

  region = "eu-north-1"
}

terraform {
  backend "s3" {
    bucket = "some-backend-bucket"
    key    = "tijpetshop8870b842.terraform.tfstate"
    region = "eu-north-1"
  }
}

resource "aws_lambda_function" "petLambdas" {
  description   = "tfinjs-aws-lambda/petLambdas"
  function_name = "tijpetshop8870b842"
  handler       = "service.handler"
  memory_size   = 512
  role          = "${data.terraform_remote_state.tijpetshop6036dcd6.tfinjs_arn}"
  runtime       = "nodejs8.10"
  s3_bucket     = "${data.terraform_remote_state.tijpetshop55b93834.tfinjs_id}"
  s3_key        = "tijpetshop6a7d0489.zip"
  timeout       = 30
}

data "terraform_remote_state" "tijpetshop55b93834" {
  backend = "s3"

  config = {
    bucket = "some-backend-bucket"
    key    = "tijpetshop55b93834.terraform.tfstate"
    region = "eu-north-1"
  }
}

data "terraform_remote_state" "tijpetshop6036dcd6" {
  backend = "s3"

  config = {
    bucket = "some-backend-bucket"
    key    = "tijpetshop6036dcd6.terraform.tfstate"
    region = "eu-north-1"
  }
}
