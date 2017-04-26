import React from "react";

class ApplicationError extends React.Component {

  render() {
    const { error } = this.props;

    return (
      <div data-role="application-error" className="container">
        <p>Something went wrong</p>
        <input type="hidden" value={error.message} />
      </div>
    );
  }

}

export default ApplicationError;
