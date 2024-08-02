
# Module: Lambda

resource "aws_lambda_function" "default" {
  function_name = "example"
  handler       = "index.handler"
  runtime       = "nodejs12.x"
}

# Module: ECS

resource "aws_ecs_cluster" "default" {
  name = "example"
}

# Module: Redshift

resource "aws_redshift_cluster" "default" {
  cluster_identifier = "example"
  database_name      = "exampledb"
  master_username    = "admin"
  master_password    = "password"
  node_type          = "dc1.large"
  cluster_type       = "single-node"
}

# Module: Lambda

resource "aws_lambda_function" "default" {
  function_name = "example"
  handler       = "index.handler"
  runtime       = "nodejs12.x"
}
