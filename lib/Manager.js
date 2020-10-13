const Employee = require("./Employee");

class Manager extends Employee {
  constructor(name, id, email, contact) {
    super(name, id, email);
    this.contact = contact;
  }
  getContact() {
    return this.contact;
  }
  getRole() {
    return "Manager";
  }
}

module.exports = Manager;