class HelloMessage extends React.Component {
  render() {
<<<<<<< HEAD
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
=======
    return <div>Hello {this.props.name}</div>;
  }
}

root.render(<HelloMessage name="Taylor" />);
>>>>>>> 664dd5736287e01a4557cd03c9a8736682911b34
