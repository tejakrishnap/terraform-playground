service_name        = "my-ecs-service"
cluster_name        = "my-ecs-cluster"
task_definition_arn = "arn:aws:ecs:us-east-1:123456789012:task-definition/my-task-def"
desired_count       = 2
launch_type         = "FARGATE"

target_group_arn    = "arn:aws:elasticloadbalancing:us-east-1:123456789012:targetgroup/my-tg/50dc6c495c0c9188"
container_name      = "my-container"
container_port      = 80

subnet_ids          = ["subnet-abcde123", "subnet-xyz987654"]
security_group_ids  = ["sg-0123456789abcdef"]

assign_public_ip    = true

tags = {
  Environment = "production"
}
