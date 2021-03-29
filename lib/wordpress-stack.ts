import * as cdk from '@aws-cdk/core';
import * as ec2 from "@aws-cdk/aws-ec2";
import * as ecs from "@aws-cdk/aws-ecs";
import * as ecr from '@aws-cdk/aws-ecr';
import * as ecs_patterns from "@aws-cdk/aws-ecs-patterns";
import { Ec2Service } from '@aws-cdk/aws-ecs';
import { CfnParameter } from '@aws-cdk/core';
import { project } from "./project-config";

export class WordpressStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const vpc = ec2.Vpc.fromLookup(this, project.vpc.name, {
      isDefault: project.vpc.useDefault,
      vpcId: project.vpc.vpcId
      
    });

    const cluster = new ecs.Cluster(this, `${project.name}-${project.environment}`, {
      vpc: vpc
    });

    const repository = new ecr.Repository(this, `${project.owner}-${project.name}-${project.environment}`, {
      repositoryName: `${project.owner}-${project.name}-${project.environment}`
    });

    new ecs_patterns.ApplicationLoadBalancedFargateService(this, `${project.name}-${project.environment}-web`, {
      cluster: cluster, // Required
      cpu: project.service.cpu, // Default is 256
      desiredCount: project.service.desiredCount, // Default is 1
      taskImageOptions: { image: ecs.ContainerImage.fromEcrRepository(repository) },
      memoryLimitMiB: project.service.memoryLimitMiB, // Default is 512
      publicLoadBalancer: project.service.publicLoadBalancer // Default is false
    });
  }
}