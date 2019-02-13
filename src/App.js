import React, { Component } from "react";
import "./App.css";
import axios from "axios";
import ListItem from "./components/ListItem";

class App extends Component {
  state = {
    dbUrl: "http://localhost:3000/",
    inputItem: "",
    searchItem: "",
    itemsList: [],
    filteredList: [] //Contient les mêmes objets 'item' qu'itemsList
  };

  componentDidMount = async () => {
    const response = await axios.get(this.state.dbUrl);
    this.setState({ itemsList: response.data, filteredList: response.data });
  };
  // Filtrage de la liste
  getFilteredList = () => {
    const filter = this.state.searchItem;
    // Liste complète par défaut
    let newFilteredList = [...this.state.itemsList];
    // Liste filtrée s'il y a des caractères dans la zone de recherche
    if (filter.length) {
      newFilteredList = this.state.itemsList.filter(objItem => {
        return objItem.title.toLowerCase().indexOf(filter.toLowerCase()) >= 0;
      });
    }
    this.sortArray(newFilteredList);
    this.setState({ filteredList: newFilteredList });
  };
  // Création de la liste des Items
  renderList = () => {
    return this.state.filteredList.map((item, i) => {
      return (
        <ListItem
          key={i}
          index={i}
          itemId={item._id}
          itemDone={item.done}
          callback={this.listItemCallBack}
          callbackDragStart={this.handleDragStart}
          callbackDragOver={this.handleDragOver}
          callbackDrop={this.handleDrop}
        >
          {item.title}
        </ListItem>
      );
    });
  };

  // ------ //
  // HANDLE //
  // ------ //
  // Change Filter
  // filteredList est créée à partir d'itemList
  handleFilter = event => {
    this.setState({ searchItem: event.target.value }, this.getFilteredList);
  };

  // Change Search
  handleChange = event => {
    this.setState({ inputItem: event.target.value }, this.getFilteredList);
  };

  // Submit
  handleSubmit = async event => {
    event.preventDefault();
    // N'enregistre pas d'item null
    if (this.state.inputItem) {
      const response = await axios.post(this.state.dbUrl + "create/", { title: this.state.inputItem });
      if (response)
        this.setState(
          {
            inputItem: "",
            itemsList: response.data
          },
          this.getFilteredList
        );
    }
  };
  // ------------------ //
  // HANDLE DRAG & DROP //
  // ------------------ //
  handleDragOver = event => {
    event.preventDefault();
  };
  handleDragStart = (event, fromIndex) => {
    event.dataTransfer.setData("fromIndex", fromIndex);
  };
  handleDrop = (event, toIndex) => {
    const fromIndex = Number(event.dataTransfer.getData("fromIndex"));

    if (fromIndex !== toIndex) {
      const newListOrder = [...this.state.itemsList];
      const movedObject = newListOrder.splice(fromIndex, 1); // Suppression de l'objet de son index initial
      newListOrder.splice(toIndex, 0, movedObject[0]); // Insertion de l'objet à l'index de destination
      this.setState(
        {
          itemsList: newListOrder.map((item, i) => {
            item.order = i;
            return item;
          })
        },
        this.getFilteredList
      );
    }
  };
  // ---------------- //
  // USEFUL FUNCTIONS //
  // ---------------- //
  // Return the id of a found object in an array
  // A REMPLACER par findIndex()
  getIndexFromId = (objArray, Id) => {
    for (let i = 0; i < objArray.length; i++) {
      if (objArray[i]._id === Id) {
        return i;
      }
    }
    return false;
  };
  // Sort the items's array out from the 'order' property
  sortArray = array => {
    return array.sort((a, b) => {
      return a.order - b.order;
    });
  };
  // ---------------------- //
  // HANDLE LISTITEM EVENTS //
  // ---------------------- //
  // CALLBACK of the child ListItem events
  listItemCallBack = async (action, itemId, done) => {
    // Barrage de l'élément cliqué => UPDATE
    if (action === "check") {
      done = done === true ? false : true;
      const response = await axios.post(this.state.dbUrl + "update/", { id: itemId, done: done });
      if (response) {
        this.setState({ itemsList: response.data }, this.getFilteredList);
      }
    } else {
      // Suppression de l'item cliqué => DELETE
      const response = await axios.post(this.state.dbUrl + "delete/", { id: itemId });
      if (response) {
        this.setState({ itemsList: response.data }, this.getFilteredList);
      }
    }
  };
  // ------ //
  // RENDER //
  // ------ //
  render() {
    return (
      <div className="container">
        <h1>To Do List</h1>
        <input type="text" name="search" value={this.state.searchItem} placeholder="Search an item" onChange={this.handleFilter} />
        <ul>{this.renderList()}</ul>
        <form onSubmit={this.handleSubmit}>
          <input type="text" name="item" value={this.state.inputItem} placeholder="Enter an item" onChange={this.handleChange} />
          <button type="submit" value="Submit">
            New item
          </button>
        </form>
      </div>
    );
  }
}

export default App;
