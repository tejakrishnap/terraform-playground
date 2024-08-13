/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('playground', function (table) {
    table.increments('id');
    table.string('name').primary();
    table.text('items'); // Changed from string to text
    table.string('webhook');
    table.string('backend');
    table.string('access_key');
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('playground');
};
