export interface Project {
    name: String,
    environment: String,
    owner: String,
    vpc: {
      name: string,
      vpcId?: string,
      useDefault: boolean
    },
    service: {
      cpu: number,
      desiredCount: number,
      memoryLimitMiB: number,
      publicLoadBalancer: boolean
    }
  }