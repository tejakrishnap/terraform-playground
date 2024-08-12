variable "service_name" {
  description = "Name of the ECS service"
  type        = string
}

variable "cluster_name" {
  description = "Name of the ECS cluster"
  type        = string
}

variable "task_definition_arn" {
  description = "ARN of the task definition to use for the service"
  type        = string
}

variable "desired_count" {
  description = "The number of instances of the task definition to run"
  type        = number
  default     = 1
}

variable "launch_type" {
  description = "Launch type for the ECS service (EC2 or FARGATE)"
  type        = string
  default     = "EC2"
}

variable "target_group_arn" {
  description = "ARN of the target group for the load balancer"
  type        = string
}

variable "container_name" {
  description = "Name of the container to associate with the load balancer"
  type        = string
}

variable "container_port" {
  description = "Port number on the container to associate with the load balancer"
  type        = number
}

variable "subnet_ids" {
  description = "List of subnet IDs for the ECS service"
  type        = list(string)
}

variable "security_group_ids" {
  description = "List of security group IDs to associate with the service"
  type        = list(string)
}

variable "assign_public_ip" {
  description = "Assign a public IP address to the ECS service"
  type        = bool
  default     = false
}

variable "service_registry_arn" {
  description = "ARN of the service registry (optional)"
  type        = string
  default     = null
}

variable "minimum_healthy_percent" {
  description = "Minimum percentage of tasks that must remain healthy during a deployment"
  type        = number
  default     = 50
}

variable "maximum_percent" {
  description = "Maximum percentage of tasks that can be running during a deployment"
  type        = number
  default     = 200
}

variable "tags" {
  description = "A map of tags to assign to the service"
  type        = map(string)
  default     = {}
}
