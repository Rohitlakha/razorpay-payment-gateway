/*
========================================
Automatic project support for ALL students
No manual project registration required
========================================
*/

module.exports = new Proxy({}, {

  get: function(target, projectId) {

    return {

      name: projectId,

      description: "Student Project Payment",

      active: true

    };

  }

});
