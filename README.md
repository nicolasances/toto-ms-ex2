# Toto Microservice Example

This repo is a simple example of a Toto Microservice that is depoyed on both GCP and AWS simultaneously. 
* **Github Actions** triggers the deployment on GCP
* **AWS CodePipeline** (configured through Terraform) triggers the deployment on AWS

Useful resources: 

* [Toto Microservice Template for NodeJS](https://github.com/nicolasances/toto-node-template)
* [Terraforming AWS for Toto](https://github.com/nicolasances/toto-aws-terra)
* [Terraforming GCP for Toto](https://github.com/nicolasances/toto-terra)