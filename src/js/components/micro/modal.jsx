import React from "react";

class Modal extends React.Component {

  render() {
    const { body, title, signals } = this.props;

    return (
      <section className="modal is-active">
        <div className="modal-background"></div>
        <main className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">{title}</p>
            <a className="button delete" onClick={signals.close}></a>
          </header>
          <section className="modal-card-body">{body}</section>
        </main>
      </section>
    );
  }

}

export default Modal;
