resource "aws_ecs_task_definition" "this" {
  family                   = var.family
  container_definitions    = var.container_definitions
  task_role_arn            = var.task_role_arn
  execution_role_arn       = var.execution_role_arn
  network_mode             = var.network_mode
  requires_compatibilities = var.requires_compatibilities
  cpu                      = var.cpu
  memory                   = var.memory
  tags                     = var.tags
}
