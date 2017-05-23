import React from "react";

export default class Icon extends React.Component {

  render() {
    const { icon_id, size } = this.props;
    const icon_class_list = [ "fa", `fa-${icon_id}` ];
    const span_class_list = [ "icon", "is-block" ];

    if(size) span_class_list.push(`is-${size}`);

    return (
      <span className={span_class_list.join(" ")}>
        <i className={icon_class_list.join(" ")} aria-hidden="true"></i>
      </span>
    );
  }

}

export function factory(icon_id) {
  return function(additional_props) {
    const props = { ...additional_props, icon_id };

    return React.createElement(Icon, props);
  };
}
