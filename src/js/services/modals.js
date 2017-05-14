import utils from "hoctable/utils";
import React from "react";
import ReactDOM from "react-dom";
import Modal from "charcoal/components/micro/modal";

const internals = { stack : [ ] };
export const CONTAINER_CLASS = "modal-container";

export default {

  open(body, title) {
    const uuid = utils.uuid();
    const { mount_point } = internals;

    if(!mount_point) {
      return -1;
    }

    const close = this.close.bind(this, uuid);
    const modal = React.createElement(Modal, { title, body, close });
    const container = utils.dom.create("article", null, [ CONTAINER_CLASS ]);

    internals.stack.push({ uuid, container });

    ReactDOM.render(modal, container);

    mount_point.appendChild(container);

    return uuid;
  },

  close(target_uuid) {
    const { stack, mount_point } = internals;

    for(let i = 0, c = stack.length; i < c; i++) {
      const { uuid, container } = stack[i];
      if(uuid !== target_uuid) continue;
      ReactDOM.unmountComponentAtNode(container);
      mount_point.removeChild(container);

      stack.splice(i, 1);

      return uuid;
    }
  },

  mount(element) {
    const { stack } = internals;

    for(let i = 0, c = stack.length; i < c; i++) {
      const { uuid } = stack[i];
      this.close(uuid);
    }

    internals.mount_point = element;
  }

};
