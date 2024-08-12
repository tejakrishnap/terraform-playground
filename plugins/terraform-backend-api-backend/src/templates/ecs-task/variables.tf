variable "family" {
  description = "Name of the task definition family"
  type        = string
}

variable "container_definitions" {
  description = "JSON definition of the containers in the task"
  type        = string
}

variable "task_role_arn" {
  description = "ARN of the IAM role that allows the ECS tasks to make calls to AWS services"
  type        = string
  default     = null
}

variable "execution_role_arn" {
  description = "ARN of the IAM role that grants the ECS agent permission to pull images and publish logs"
  type        = string
  default     = null
}

variable "network_mode" {
  description = "The Docker networking mode to use for the containers in the task"
  type        = string
  default     = "bridge"
}

variable "requires_compatibilities" {
  description = "A list of launch types required by the task"
  type        = list(string)
  default     = ["EC2"]
}

variable "cpu" {
  description = "The number of cpu units used by the task"
  type        = string
  default     = "256"
}

variable "memory" {
  description = "The amount of memory (in MiB) used by the task"
  type        = string
  default     = "512"
}

variable "tags" {
  description = "A map of tags to assign to the resource"
  type        = map(string)
  default     = {}
}
