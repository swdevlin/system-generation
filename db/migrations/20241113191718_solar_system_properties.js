/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.alterTable('solar_system', table => {
    table.integer('gas_giant_count').defaultTo(0); // Number of gas giants, default to 0
    table.integer('planetoid_belt_count').defaultTo(0); // Number of planetoid belts, default to 0
    table.integer('terrestrial_planet_count').defaultTo(0); // Number of terrestrial planets, default to 0
    table.text('bases'); // Bases in the system (could be a comma-separated list or JSON, depending on needs)
    table.text('remarks'); // Additional remarks
    table.boolean('native_sophont').defaultTo(false); // Native sophont presence, default false
    table.boolean('extinct_sophont').defaultTo(false); // Extinct sophont presence, default false
    table.integer('star_count').defaultTo(1); // Number of stars, default to 1
    table.jsonb('stellar_objects');
    table.jsonb('main_world');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable('solar_system', table => {
    table.dropColumn('gas_giant_count');
    table.dropColumn('planetoid_belt_count');
    table.dropColumn('terrestrial_planet_count');
    table.dropColumn('bases');
    table.dropColumn('remarks');
    table.dropColumn('native_sophont');
    table.dropColumn('extinct_sophont');
    table.dropColumn('star_count');
    table.dropColumn('stellar_objects');
    table.dropColumn('main_world');
  });

};
