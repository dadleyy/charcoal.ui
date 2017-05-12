import React from "react";

class StatusTag extends React.Component {

  render() {
    const { children, status } = this.props;
    const tag_classes = [ "tag" ];

    switch (status) {
    case "ACTIVE":
      tag_classes.push("is-success");
      break;
    case "ENDED":
      tag_classes.push("is-error");
      break;
    }

    return (<div className={tag_classes.join(" ")}>{children}</div>);
  }

}

export default StatusTag;
