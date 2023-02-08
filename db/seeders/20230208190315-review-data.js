'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   await queryInterface.bulkInsert('Reviews', [
     { reviewer: 'Alec', comment: 'This game is sweet', rating: 10, gameId: 6 },
     { reviewer: 'Dan', comment: '2gloomy4me', rating: 5, gameId: 1 },
     { reviewer: 'Olivia', comment: `Even though it's co-op, it's pretty fun`, rating: 7, gameId: 6 },
     { reviewer: 'Nate', comment: 'Animals are lame and so are animal board games', rating: 1, gameId: 10 },
     { reviewer: 'David', comment: 'Honestly, too soon.', rating: 5, gameId: 2 },
     { reviewer: 'Franco', comment: 'I can be a space pirate, enough said', rating: 9, gameId: 5 }
   ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Reviews', null)
  }
};
