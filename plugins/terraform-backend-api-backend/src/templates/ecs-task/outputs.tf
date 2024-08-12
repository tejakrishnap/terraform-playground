output "task_definition_arn" {
  description = "ARN of the created ECS Task Definition"
  value       = aws_ecs_task_definition.this.arn
}

output "task_definition_revision" {
  description = "Revision of the ECS Task Definition"
  value       = aws_ecs_task_definition.this.revision
}
