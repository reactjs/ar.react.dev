class HelloMessage extends React.Component {
  render() {
    return (
      <div dir="rtl">
        مرحبا {this.props.name}
      </div>
    );
  }
}

ReactDOM.render(
  <HelloMessage name="أحمد" />,
  document.getElementById('hello-example')
);
