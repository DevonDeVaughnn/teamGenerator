const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const fs = require("fs");
var teamList = [];
const forManager= [
  {
    type: "input",
    name: "name",
    message: "Enter manager name:",
    validate: async (input) => {
      if (input == "" || /\s/.test(input)) {
        return "Please enter first or last name.";
      }
      return true;
    },
  },
  {
    type: "input",
    name: "email",
    message: "Enter manager's email:",
    validate: async (input) => {
      if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(input)) {
        return true;
      }
      return "Please enter a valid email address.";
    },
  },
  {
    type: "input",
    name: "contact",
    message: "What is your office number?:",
    validate: async (input) => {
      if (isNaN(input)) {
        return "Please enter a number";
      }
      return true;
    },
  },
  {
    type: "list",
    name: "moreTeam",
    message: "Do you have any team members that you would like to add?",
    choices: ["Yes", "No"],
  },
];

const forEmployee = [
  {
    type: "input",
    name: "name",
    message: "Enter employee name:",
    validate: async (input) => {
      if (input == "") {
        return "Please enter a name.";
      }
      return true;
    },
  },
  {
    type: "input",
    name: "email",
    message: "Enter their email:",
    validate: async (input) => {
      if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(input)) {
        return true;
      }
      return "Please enter a valid email address.";
    },
  },
  {
    type: "list",
    name: "role",
    message: "What is their role?",
    choices: ["engineer", "intern"],
  },
  {
    when: (input) => {
      return input.role == "engineer";
    },
    type: "input",
    name: "github",
    message: "Enter your github username:",
    validate: async (input) => {
      if (input == "" || /\s/.test(input)) {
        return "Please enter a valid GitHub username";
      }
      return true;
    },
  },
  {
    when: (input) => {
      return input.role == "intern";
    },
    type: "input",
    name: "school",
    message: "Enter your school name:",
    validate: async (input) => {
      if (input == "") {
        return "Please enter a name.";
      }
      return true;
    },
  },
  {
    type: "list",
    name: "add",
    message: "Would you like to add another team member?",
    choices: ["Yes", "No"],
  },
];

function buildTeam() {
  inquirer.prompt(forEmployee).then((employeeInfo) => {
    if (employeeInfo.role == "engineer") {
      var newMember = new Engineer(
        employeeInfo.name,
        teamList.length + 1,
        employeeInfo.email,
        employeeInfo.github
      );
    } else {
      var newMember = new Intern(
        employeeInfo.name,
        teamList.length + 1,
        employeeInfo.email,
        employeeInfo.school
      );
    }
    teamList.push(newMember);
    if (employeeInfo.add === "Yes") {
      console.log(" ");
      buildTeam();
    } else {
      buildPage();
    }
  });
}

function buildPage() {
  let newFile = fs.readFileSync("./templates/main.html");
  fs.writeFileSync("./templates/main.html", newFile, function (err) {
    if (err) throw err;
  });

  console.log("Home page created!");

  for (member of teamList) {
    if (member.getRole() == "Manager") {
      buildCard(
        "Manager",
        member.getName(),
        member.getId(),
        member.getEmail(),
        "Office: " + member.getContact()
      );
    } else if (member.getRole() == "Engineer") {
      buildCard(
        "Engineer",
        member.getName(),
        member.getId(),
        member.getEmail(),
        "Github: " + member.getGithub()
      );
    } else if (member.getRole() == "Intern") {
      buildCard(
        "Intern",
        member.getName(),
        member.getId(),
        member.getEmail(),
        "School: " + member.getSchool()
      );
    }
  }
  fs.appendFileSync(
    "./templates/main.html",
    "</div></main></body></html>",
    function (err) {
      if (err) throw err;
    }
  );
  console.log("Changes Complete");
}

function buildCard(memberType, name, id, email, other) {
  let data = fs.readFileSync(`./templates/${memberType}.html`, "utf8");
  data = data.replace("Enter Name", name);
  data = data.replace("ID", `ID: ${id}`);
  data = data.replace(
    "Email", email
  );
  data = data.replace("Other", other);
  fs.appendFileSync("./templates/main.html", data, (err) => {
    if (err) throw err;
  });
  console.log("Files Appended");
}

function init() {
  inquirer.prompt(forManager).then((managerInfo) => {
    let manager = new Manager(
      managerInfo.name,
      1,
      managerInfo.email,
      managerInfo.contact
    );
    teamList.push(manager);
    console.log(" ");
    if (managerInfo.moreTeam === "Yes") {
      buildTeam();
    } else {
      buildPage();
    }
  });
}

init();