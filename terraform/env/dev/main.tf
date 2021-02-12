terraform {
  backend "s3" {
    bucket  = "alpaca-terraform"
    key     = "dev"
    region  = "us-east-1"
    profile = "alpaca"
  }
}

provider "aws" {
  profile = "alpaca"
  region  = "us-east-1"
}