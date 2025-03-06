/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('route', table => {
    table.increments('id').primary();
    table.integer('year').notNullable();
    table.integer('day').notNullable();
    table.integer('ship_id').notNullable();
    table.integer('sector_x').notNullable();
    table.integer('sector_y').notNullable();
    table.integer('hex_x').notNullable();
    table.integer('hex_y').notNullable();
    table.unique(['year', 'day', 'ship_id'])
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('route');
};
