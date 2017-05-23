import React from "react";

export class DesktopContent extends React.Component {

  render() {
    return (<main className="is-hidden-mobile">{this.props.children}</main>);
  }

}

export class MobileContent extends React.Component {

  render() {
    return (<main className="is-hidden-desktop">{this.props.children}</main>);
  }

}

export default function ResponsiveContent(content) {
  const { mobile, desktop } = content;

  return (
    <main>
      <MobileContent>{mobile}</MobileContent>
      <DesktopContent>{desktop}</DesktopContent>
    </main>
  );
}
