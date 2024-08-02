// src/terraformTemplates.ts
export const terraformTemplates: Record<string, string> = {
  ecs: `
resource "aws_ecs_cluster" "default" {
  name = "example"
}
`,
  lambda: `
resource "aws_lambda_function" "default" {
  function_name = "example"
  handler       = "index.handler"
  runtime       = "nodejs12.x"
}
`,
  rds: `
resource "aws_db_instance" "default" {
  allocated_storage    = 20
  storage_type         = "gp2"
  engine               = "mysql"
  engine_version       = "5.7"
  instance_class       = "db.t2.micro"
  name                 = "example"
  username             = "admin"
  password             = "password"
  parameter_group_name = "default.mysql5.7"
}
`,
  redshift: `
resource "aws_redshift_cluster" "default" {
  cluster_identifier = "example"
  database_name      = "exampledb"
  master_username    = "admin"
  master_password    = "password"
  node_type          = "dc1.large"
  cluster_type       = "single-node"
}
`,
};
