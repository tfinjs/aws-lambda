provider "aws" {
  assume_role = {
    role_arn = "arn:aws:iam::13371337:role/DeploymentRole"
  }

  region = "eu-north-1"
}

terraform {
  backend "s3" {
    bucket = "some-backend-bucket"
    key    = "tijpetshop6a7d0489.terraform.tfstate"
    region = "eu-north-1"
  }
}

resource "aws_s3_bucket_object" "petLambdas" {
  bucket       = "${data.terraform_remote_state.tijpetshop55b93834.tfinjs_id}"
  content_type = "application/zip"
  key          = "tijpetshop6a7d0489.zip"
  source       = "./aws_lambda_package.zip"
}

data "terraform_remote_state" "tijpetshop55b93834" {
  backend = "s3"

  config = {
    bucket = "some-backend-bucket"
    key    = "tijpetshop55b93834.terraform.tfstate"
    region = "eu-north-1"
  }
}
