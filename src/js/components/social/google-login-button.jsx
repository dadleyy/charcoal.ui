import React from "react";
import i18n from "charcoal/services/i18n";
import config from "charcoal/config/environment";

class Button extends React.Component {

  render() {
    const { google_url } = config.oauth;

    function navigate() {
      window.location = google_url;
    }

    return (
      <div className="cursor-pointer button is-light clearfix" onClick={navigate}>
        <span className="icon is-small">
          <i className="fa fa-google"></i>
        </span>
        <span>{i18n("google_login")}</span>
      </div>
    );
  }

}

export default Button;
