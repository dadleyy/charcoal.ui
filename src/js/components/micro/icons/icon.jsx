import React from "react";

export default class Icon extends React.Component {

  render() {
    const { icon_id } = this.props;
    const class_name = `fa fa-${icon_id}`;

    return (
      <span className="icon">
        <i className={class_name} aria-hidden="true"></i>
      </span>
    );
  }

}
