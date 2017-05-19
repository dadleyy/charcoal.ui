import React from "react";
import { BarsIcon } from "charcoal/components/micro/icons";

import select from "hoctable/hoc/select";

class Button extends React.Component {

  render() {
    return (
      <a className="button">
        <BarsIcon />
      </a>
    );
  }

}

export default select(undefined, Button);
