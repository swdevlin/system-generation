/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.alterTable('solar_system', table => {
    table.integer('origin_x').notNullable();
    table.integer('origin_y').notNullable();
    table.unique(['origin_x', 'origin_y']);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable('solar_system', table => {
    table.dropUnique(['origin_x', 'origin_y']);
    table.dropColumn('origin_x');
    table.dropColumn('origin_y');
  });

};
