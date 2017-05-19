import utils from "hoctable/utils";
import React from "react";
import ReactDOM from "react-dom";
import Modal from "charcoal/components/micro/modal";
import Viewport from "hoctable/services/window";

const internals = { stack : [ ] };

export const CONTAINER_CLASS = "modal-container";

function close(target_uuid) {
  const { stack, mount_point } = internals;

  for(let i = 0, c = stack.length; i < c; i++) {
    const { uuid, container } = stack[i];
    if(uuid !== target_uuid) continue;
    ReactDOM.unmountComponentAtNode(container);
    mount_point.removeChild(container);

    stack.splice(i, 1);

    return uuid;
  }
}

function open(body, title) {
  const uuid = utils.uuid();
  const { mount_point } = internals;

  if(!mount_point) {
    return -1;
  }

  const signals = { close : close.bind(null, uuid) };
  const modal = React.createElement(Modal, { title, body, signals });
  const container = utils.dom.create("article", null, [ CONTAINER_CLASS ]);

  internals.stack.push({ uuid, container });

  ReactDOM.render(modal, container);

  mount_point.appendChild(container);

  return uuid;
}

function closeLatest(event) {
  const { keyCode } = event;

  if(keyCode !== 27) return;

  const { stack } = internals;
  const [ latest ] = stack;
  if(latest) close(latest.uuid);
}

function mount(element) {
  const { stack, listeners } = internals;

  for(let i = 0, c = stack.length; i < c; i++) {
    const { uuid } = stack[i];
    this.close(uuid);
  }

  if(listeners) {
    Viewport.off(listeners.keydown);
  }

  const keydown = Viewport.on("keydown", closeLatest);
  internals.listeners = { keydown };

  internals.mount_point = element;
}

const service = { open, close, mount };

export default service;
