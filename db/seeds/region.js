/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('region').del()
  await knex('region').insert([
    {name: 'Rift', colour: "999999", label_x: 0, label_y: 0, parsecs: []},
  ]);
};
