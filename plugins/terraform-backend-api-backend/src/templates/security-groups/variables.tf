variable "ingress_rules" {
  description = "List of security group rules"
  type = list(object({
    description = string
    from_port   = number
    to_port     = number
    protocol    = string
    cidr_blocks = list(string)
  }))
}

variable "vpc_id" {
  type = string
}

variable "egress_rules" {
  description = "List of security group rules"
  type = list(object({
    description = string
    from_port   = number
    to_port     = number
    protocol    = string
    cidr_blocks = list(string)
  }))
}
