task_family = "my-task-family"

container_definitions = <<DEFINITION
[
  {
    "name": "my-container",
    "image": "nginx",
    "cpu": 256,
    "memory": 512,
    "essential": true,
    "portMappings": [
      {
        "containerPort": 80,
        "hostPort": 80
      }
    ]
  }
]
DEFINITION

task_role_arn = "arn:aws:iam::123456789012:role/my-task-role"
execution_role_arn = "arn:aws:iam::123456789012:role/my-execution-role"
network_mode = "awsvpc"
requires_compatibilities = ["FARGATE"]
cpu = "512"
memory = "1024"
tags = {
  Environment = "production"
}
