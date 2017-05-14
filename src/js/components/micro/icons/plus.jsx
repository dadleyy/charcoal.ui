import React from "react";
import Icon from "charcoal/components/micro/icons/icon";

const icon_id = "plus";

export default function PlusIcon(additional_props) {
  const props = { ...additional_props, icon_id };

  return React.createElement(Icon, props);
}
