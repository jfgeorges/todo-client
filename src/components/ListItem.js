import React from "react";

class ListItem extends React.Component {
  returnDeleteItem = () => {
    this.props.callback("delete", this.props.itemId);
  };

  returnCheckItem = () => {
    this.props.callback("check", this.props.itemId, this.props.itemDone);
  };

  returnDragStart = (event, index) => {
    this.props.callbackDragStart(event, index);
  };

  returnDragOver = event => {
    this.props.callbackDragOver(event);
  };

  returnDrop = (event, index) => {
    this.props.callbackDrop(event, index);
  };

  render() {
    let classList = "item";
    if (this.props.itemDone === true) {
      classList = classList + " strike"; // Ajoute la classe barré
    }
    return (
      <li id={"item" + this.props.id}>
        <span onClick={this.returnDeleteItem} className="puce">
          {"x "}
        </span>
        <span
          draggable
          className={classList}
          onClick={this.returnCheckItem}
          onDragStart={event => this.returnDragStart(event, this.props.index)}
          onDragOver={event => this.returnDragOver(event)}
          onDrop={event => this.returnDrop(event, this.props.index)}
        >
          {this.props.children}
        </span>
      </li>
    );
  }
}

export default ListItem;
