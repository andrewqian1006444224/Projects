//Storage controller

//test
//waidnawiodnawiodnwaeiodnwa
const storageManager = (function () {
  return {
    storeItem: function (item) {
      let items = [];
      if (localStorage.getItem("items") === null) {
        items.push(item);
        localStorage.setItem("items", JSON.stringify(items));
      } else {
        items = JSON.parse(localStorage.getItem("items"));
        items.push(item);
        localStorage.setItem("items", JSON.stringify(items));
      }
    },
    setPersonData: function (data) {
      localStorage.setItem("personData", JSON.stringify(data));
    },
    getPersonData: function () {
      return JSON.parse(localStorage.getItem("personData"));
      //test
    },
    getStorageItems: function () {
      let items = [];
      if (!(localStorage.getItem("items") === null)) {
        items = JSON.parse(localStorage.getItem("items"));
      }
      return items;
    },
    deleteItem: function (id) {
      let items = JSON.parse(localStorage.getItem("items"));
      let i = 0;
      for (; i < items.length; i++) {
        if (items[i].id === id) break;
      }
      items.splice(i, 1);
      localStorage.setItem("items", JSON.stringify(items));
    },
    deleteAllItems: function () {
      localStorage.setItem("items", JSON.stringify([]));
    },
    updateItem: function (id, name, calories) {
      let items = JSON.parse(localStorage.getItem("items"));
      for (let i = 0; i < items.length; i++) {
        if (items[i].id === id) {
          items[i].name = name;
          items[i].calories = calories;
        }
      }
      localStorage.setItem("items", JSON.stringify(items));
    },
  };
})();

//Item controller
const itemManager = (function () {
  //constructor
  const item = function (id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  };
  //data structure
  const data = {
    items: storageManager.getStorageItems(),
    currentItem: null,
    totalCalories: 0,
  };
  return {
    logData: function () {
      return data;
    },
    getItems: function () {
      return data.items;
    },
    addItem: function (name, calories) {
      let id;
      if (data.items.length == 0) {
        id = 0;
      } else {
        id = data.items[data.items.length - 1].id + 1;
      }
      const cal = parseInt(calories);
      const newItem = new item(id, name, cal);
      data.items.push(newItem); //we cant just set id = items.length since we can delete items
      return newItem;
    },
    getTotalCalories: function () {
      let total = 0;
      data.items.forEach((item) => {
        total += item.calories;
      });
      data.totalCalories = total;
      return total;
    },
    getItemById: function (id) {
      let wantedItem = null;
      data.items.forEach((item) => {
        if (item.id === id) {
          wantedItem = item;
        }
      });
      return wantedItem;
    },
    setCurrentItem: function (item) {
      data.currentItem = item;
    },
    getCurrentItem: function () {
      return data.currentItem;
    },
    updateItem: function (name, calories) {
      calories = parseInt(calories);
      let currItem = null;
      data.items.forEach((item) => {
        if (item.id === data.currentItem.id) {
          item.name = name;
          item.calories = calories;
          currItem = item;
        }
      });
      return currItem;
    },
    deleteItem: function (id) {
      ids = data.items.map(function (item) {
        return item.id;
      });
      const index = ids.indexOf(id);
      data.items.splice(index, 1);
    },
    clearAllItems: function () {
      data.items = [];
    },
  };
})();

const personManager = (function () {
  const person = function (gender, plan, weight, height, age, exercised) {
    this.gender = gender;
    this.plan = plan;
    this.weight = weight;
    this.height = height;
    this.age = age;
    this.exercised = exercised;
  };

  const data = {
    person: null,
    daileyCalories: 0,
  };
  return {
    addPerson: function (gender, plan, weight, age, height, exercise) {
      //person.gender, person.plan, person.weight, person.age, person.height, person.exercise
      const thisPerson = new person(
        gender,
        plan,
        parseInt(weight),
        parseInt(height),
        parseInt(age),
        parseInt(exercise)
      );
      data.person = thisPerson;
    },
    getData: function () {
      return data;
    },
    getDailyCalories: function () {
      let bmr;
      let daileyCalories;
      if (data.person.gender === "Male") {
        bmr =
          66 +
          6.3 * data.person.weight +
          12.9 * data.person.height * 0.4 -
          6.8 * data.person.age;
      } else {
        bmr =
          655 +
          4.3 * data.person.weight +
          4.7 * data.person.height * 0.4 -
          4.7 * data.person.age;
      }

      if (data.person.exercise < 4) {
        daileyCalories = bmr * 1.375;
      } else if (person.exercise < 6) {
        daileyCalories = bmr * 1.55;
      } else if (person.exercise < 8) {
        daileyCalories = bmr * 1.725;
      } else {
        daileyCalories = bmr * 1.9;
      }

      if (data.person.plan === "Weightloss") {
        daileyCalories -= 750;
      } else if (data.person.plan === "Bulk") {
        daileyCalories += 750;
      }
      data.daileyCalories = daileyCalories;
      return daileyCalories;
    },
  };
})();
//UI controller
const uiManager = (function () {
  const uiSelector = {
    itemList: "#item-list",
    addItem: ".add-btn",
    updateItem: ".update-btn",
    deleteItem: ".delete-btn",
    backbtn: ".back-btn",
    addPerson: ".add-person",
    personWeight: "#person-weight",
    personHeight: "#person-height",
    personAge: "#person-age",
    personExercise: "#person-exercise",
    itemNameInput: "#item-name",
    itemCaloriesInput: "#item-calories",
    totalCalories: ".total-calories",
    requiredCalories: ".needed-calories",
    listItem: "#item-list li",
    clearBtnItem: "#clearBtn-list",
    changePerson: "#changeBtn-person",
    personForm: ".container-person",
  };
  return {
    populateList: function (items) {
      let html = "";
      items.forEach(function (item) {
        html += `<li class="collection-item" id="item-${item.id}">
        <strong>${item.name}: </strong><em>${item.calories} calories</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil"></i>
        </a>
      </li>`;
      });
      document.querySelector(uiSelector.itemList).innerHTML = html;
    },
    getSelectors: function () {
      return uiSelector;
    },
    getItemInput: function () {
      return {
        name: `${document.querySelector(uiSelector.itemNameInput).value}`,
        calories: `${
          document.querySelector(uiSelector.itemCaloriesInput).value
        }`,
      };
    },
    getPersonInput: function () {
      const selection = document.getElementById("select-gender");
      const gender = selection.options[selection.selectedIndex].text;
      const selection2 = document.getElementById("select-plan");
      const plan = selection2.options[selection2.selectedIndex].text;
      const weight = document.querySelector(uiSelector.personWeight).value;
      const height = document.querySelector(uiSelector.personHeight).value;
      const age = document.querySelector(uiSelector.personAge).value;
      const exercise = document.querySelector(uiSelector.personExercise).value;
      return {
        gender: `${gender}`,
        plan: `${plan}`,
        weight: `${weight}`,
        height: `${height}`,
        age: `${age}`,
        exercise: `${exercise}`,
      };
    },
    addItemToList: function (item) {
      document.querySelector(uiSelector.itemList).style.display = "block";
      const li = document.createElement("li");
      li.className = "collection-item";
      li.id = `item-${item.id}`;
      li.innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
      <a href="#" class="secondary-content">
        <i class="edit-item fa fa-pencil"></i>
      </a>`;
      document
        .querySelector(uiSelector.itemList)
        .insertAdjacentElement(`beforeend`, li);
    },
    clearItemFields: function () {
      document.querySelector(uiSelector.itemNameInput).value = "";
      document.querySelector(uiSelector.itemCaloriesInput).value = "";
    },
    clearPersonFields: function () {
      document.querySelector(uiSelector.personAge).value = "";
      document.querySelector(uiSelector.personExercise).value = "";
      document.querySelector(uiSelector.personHeight).value = "";
      document.querySelector(uiSelector.personWeight).value = "";
    },
    hidePersonForm: function () {
      document.querySelector(uiSelector.personForm).style.display = "none";
    },
    showPersonForm: function () {
      document.querySelector(uiSelector.personForm).style.display = "block";
      this.setRequiredCalories(0);
    },
    hideList: function () {
      document.querySelector(uiSelector.itemList).style.display = "none";
    },
    setTotalCalories: function (total) {
      document.querySelector(uiSelector.totalCalories).textContent = total;
    },
    setRequiredCalories: function (needed) {
      document.querySelector(uiSelector.requiredCalories).textContent = needed;
    },
    clearEditState: function () {
      this.clearItemFields();
      document.querySelector(uiSelector.updateItem).style.display = "none";
      document.querySelector(uiSelector.deleteItem).style.display = "none";
      document.querySelector(uiSelector.backbtn).style.display = "none";
      document.querySelector(uiSelector.addItem).style.display = "inline";
    },
    showEditState: function () {
      document.querySelector(uiSelector.updateItem).style.display = "inline";
      document.querySelector(uiSelector.deleteItem).style.display = "inline";
      document.querySelector(uiSelector.backbtn).style.display = "inline";
      document.querySelector(uiSelector.addItem).style.display = "none";
    },
    addItemToForm: function () {
      item = itemManager.getCurrentItem();
      document.querySelector(uiSelector.itemNameInput).value = item.name;
      document.querySelector(uiSelector.itemCaloriesInput).value =
        item.calories;
      uiManager.showEditState();
    },
    updateItem: function (item) {
      let nodelist = document.querySelectorAll(uiSelector.listItem);
      let listItems = Array.from(nodelist);
      listItems.forEach((item2) => {
        const item2id = item2.getAttribute("id");
        if (item2id == `item-${item.id}`) {
          document.querySelector(
            `#${item2id}`
          ).innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
          <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i>
          </a>`;
        }
      });
      const totalCalories = itemManager.getTotalCalories();
      uiManager.setTotalCalories(totalCalories);
      uiManager.clearEditState();
    },
    deleteItem: function (id) {
      const itemid = `#item-${id}`;
      document.querySelector(itemid).remove();
      const totalCalories = itemManager.getTotalCalories();
      uiManager.setTotalCalories(totalCalories);
      uiManager.clearEditState();
    },
    clearAllItems: function () {
      document.querySelector(uiSelector.itemList).innerHTML = "";
      this.setTotalCalories(0);
    },
  };
})();

//App controller
const appManager = (function (itemManager, uiManager) {
  const loadEventListeners = function () {
    const uiSelectors = uiManager.getSelectors();

    //adds item
    document
      .querySelector(uiSelectors.addItem)
      .addEventListener("click", function (e) {
        const input = uiManager.getItemInput();
        if (input.name != "" && input.calories != "") {
          const newItem = itemManager.addItem(input.name, input.calories);
          uiManager.addItemToList(newItem);
          const totalCalories = itemManager.getTotalCalories();
          uiManager.setTotalCalories(totalCalories);
          storageManager.storeItem(newItem);
          uiManager.clearItemFields();
        }
        e.preventDefault();
      });

    //MUST USE EVENT DELEGATION
    //Edit item
    document
      .querySelector(uiSelectors.itemList)
      .addEventListener("click", function (e) {
        if (e.target.classList.contains("edit-item")) {
          const listid = e.target.parentNode.parentNode.id;
          const listIdArr = listid.split("-");
          const item = itemManager.getItemById(parseInt(listIdArr[1]));
          itemManager.setCurrentItem(item);
          uiManager.addItemToForm();
        }
        e.preventDefault();
      });

    //prevents enter key from working so that it doesnt update when in edit state
    document.addEventListener("keypress", function (e) {
      if (e.keyCode === 13) {
        e.preventDefault();
        return false;
      }
    });

    //update item
    document
      .querySelector(uiSelectors.updateItem)
      .addEventListener("click", function (e) {
        const input = uiManager.getItemInput();
        const item = itemManager.updateItem(input.name, input.calories);
        storageManager.updateItem(
          itemManager.getCurrentItem().id,
          input.name,
          input.calories
        );
        uiManager.updateItem(item);
        e.preventDefault();
      });

    //back button
    document
      .querySelector(uiSelectors.backbtn)
      .addEventListener("click", function (e) {
        uiManager.clearEditState();
        e.preventDefault();
      });

    //delete item
    document
      .querySelector(uiSelectors.deleteItem)
      .addEventListener("click", function (e) {
        const currItem = itemManager.getCurrentItem();
        itemManager.deleteItem(currItem.id);
        uiManager.deleteItem(currItem.id);
        storageManager.deleteItem(currItem.id);
        e.preventDefault();
      });

    //deletes all items
    document
      .querySelector(uiSelectors.clearBtnItem)
      .addEventListener("click", function (e) {
        itemManager.clearAllItems();
        uiManager.clearAllItems();
        storageManager.deleteAllItems();
        e.preventDefault();
      });

    function addPerson() {
      const person = uiManager.getPersonInput();
      if (
        person.gender != "Choose your gender" &&
        person.plan != "Choose your plan" &&
        person.weight != "" &&
        person.age != "" &&
        person.height != "" &&
        person.exercise != ""
      ) {
        personManager.addPerson(
          person.gender,
          person.plan,
          person.weight,
          person.age,
          person.height,
          person.exercise
        );

        const requiredCals = personManager.getDailyCalories();

        uiManager.setRequiredCalories(Math.round(parseInt(requiredCals)));
        uiManager.clearPersonFields();
        uiManager.hidePersonForm();
      }
    }
    //add person
    document
      .querySelector(uiSelectors.addPerson)
      .addEventListener("click", function (e) {
        addPerson();
        storageManager.setPersonData(personManager.getData());
        e.preventDefault();
      });

    //change person
    document
      .querySelector(uiSelectors.changePerson)
      .addEventListener("click", function (e) {
        uiManager.showPersonForm();
        e.preventDefault();
      });
  };

  return {
    //initializes the setup
    init: function () {
      uiManager.clearEditState();
      if (storageManager.getPerson != null) {
        uiManager.hidePersonForm();
      }
      uiManager.clearPersonFields();
      $(document).ready(function () {
        $("#select-gender").formSelect();
      });
      $(document).ready(function () {
        $("#select-plan").formSelect();
      });

      const items = itemManager.getItems();
      if (items.length == 0) {
        uiManager.hideList();
      } else {
        uiManager.populateList(items);
      }

      const totalCalories = itemManager.getTotalCalories();
      uiManager.setTotalCalories(totalCalories);
      let requiredCalories = 0;
      if (storageManager.getPersonData() != null) {
        requiredCalories = storageManager.getPersonData().daileyCalories;
        uiManager.hidePersonForm();
      } else {
        uiManager.showPersonForm();
      }

      uiManager.setRequiredCalories(Math.round(requiredCalories));
      loadEventListeners();
    },
  };
})(itemManager, uiManager, storageManager);

appManager.init();
