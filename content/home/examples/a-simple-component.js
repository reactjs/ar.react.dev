class HelloMessage extends React.Component {
  render() {
    return
      <div dir="rtl">مرحبا {this.props.name}</div>;
  }
}

root.render(<HelloMessage name="أحمد" />);
