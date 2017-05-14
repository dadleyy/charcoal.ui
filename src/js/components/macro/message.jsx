import React from "react";

export default class Message extends React.Component {

  render() {
    const { children } = this.props;

    return (
      <article className="message">
        <section className="message-body">{children}</section>
      </article>
    );
  }

}
