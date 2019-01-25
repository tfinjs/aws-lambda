provider "aws" {
  assume_role = {
    role_arn = "arn:aws:iam::13371337:role/DeploymentRole"
  }

  region = "eu-north-1"
}

terraform {
  backend "s3" {
    bucket = "some-backend-bucket"
    key    = "tijpetshop55b93834.terraform.tfstate"
    region = "eu-north-1"
  }
}

resource "aws_s3_bucket" "terraform_state_prod" {
  acl    = "private"
  bucket = "lambda-deployment-bucket"

  versioning = {
    enabled = true
  }
}

output "tfinjs_id" {
  value = "${aws_s3_bucket.terraform_state_prod.id}"
}
