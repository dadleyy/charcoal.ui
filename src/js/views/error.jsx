import React from "react";

class ApplicationError extends React.Component {

  render() {
    const { props } = this;
    const { resolution } = props;
    const error = (resolution && resolution.error) || props.error;

    return (
      <div data-role="application-error" className="container">
        <p>Something went wrong</p>
        <input type="hidden" data-role="error-value" value={error ? error.message : "unknown"} />
      </div>
    );
  }

}

export default ApplicationError;
