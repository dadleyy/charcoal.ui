import React from "react";
import Icon from "charcoal/components/micro/icons/icon";

const icon_id = "check";

export default function CheckIcon(additional_props) {
  const props = { ...additional_props, icon_id };

  return React.createElement(Icon, props);
}
